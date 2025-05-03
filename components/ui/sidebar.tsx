
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem'; // 256px
const SIDEBAR_WIDTH_ICON = '3rem'; // 48px

const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContextValue = {
  state: 'expanded' | 'collapsed';
  open: boolean; // Desktop state
  setOpen: (open: boolean | ((prevState: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  // No need for separate mobile state here if SidebarProvider handles it
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const isMobile = useIsMobile(); // Check if mobile inside the provider

    const setOpen = React.useCallback(
      (value: boolean | ((prevState: boolean) => boolean)) => {
        const newState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(newState);
        } else {
          _setOpen(newState);
        }
        // Persist state (optional) only on desktop
        if (!isMobile) {
          try {
            localStorage.setItem(SIDEBAR_COOKIE_NAME, JSON.stringify(newState));
          } catch (e) {
            console.warn('Could not save sidebar state to localStorage:', e);
          }
        }
      },
      [open, setOpenProp, isMobile]
    );

    // Load persisted state on mount, only on desktop
    React.useEffect(() => {
       if (!isMobile) {
          try {
            const savedState = localStorage.getItem(SIDEBAR_COOKIE_NAME);
            if (savedState !== null) {
                // Only apply saved state if openProp is not provided
               if (openProp === undefined) {
                   _setOpen(JSON.parse(savedState));
               }
            }
          } catch (e) {
            console.warn('Could not load sidebar state from localStorage:', e);
          }
       }
     }, [isMobile, openProp]);


    const toggleSidebar = React.useCallback(() => {
      setOpen((prev) => !prev);
    }, [setOpen]);

    // Keyboard shortcut
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    // Determine state based on `open` and `isMobile`
    // Sidebar is always 'expanded' conceptually on mobile, display handled by CSS/components
    const state = isMobile ? 'expanded' : open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        toggleSidebar,
      }),
      [state, open, setOpen, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            // Removed group/sidebar-wrapper and direct width style, handled by Sidebar component
            className={cn("flex min-h-svh w-full", className)}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

// --- Sidebar component ---
const sidebarVariants = cva(
  // Use theme variables for colors defined in globals.css
  "group fixed inset-y-0 z-40 flex h-svh flex-col border-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out",
  {
    variants: {
      side: {
        left: "left-0 border-r",
        right: "right-0 border-l",
      },
       variant: {
         sidebar: "", // Base styles
         floating: "m-2 h-[calc(100svh-theme(spacing.4))] rounded-lg shadow-lg",
       },
      state: {
         expanded: "w-[--sidebar-width]",
         collapsed: "w-[--sidebar-width-icon] items-center", // Center items when collapsed via icon
      },
      collapsible: {
         icon: "", // Style applied based on state
         none: "w-[--sidebar-width]", // Always expanded width
      },
    },
    compoundVariants: [
        // When collapsible is 'none', always use expanded width regardless of state
        { collapsible: "none", state: "collapsed", className: "w-[--sidebar-width] items-start" }, // Reset items-center
        { collapsible: "none", state: "expanded", className: "w-[--sidebar-width]" },
         // When collapsible is 'icon', width depends on state
         { collapsible: "icon", state: "expanded", className: "w-[--sidebar-width]" },
         { collapsible: "icon", state: "collapsed", className: "w-[--sidebar-width-icon] items-center" },
    ],
    defaultVariants: {
      side: "left",
      variant: "sidebar",
      state: "expanded",
       collapsible: "icon",
    },
  }
);


const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof sidebarVariants> & {
    collapsible?: 'icon' | 'none'; // Keep explicit collapsible prop
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'icon', // Default to icon collapsing
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar(); // Get state from context
    const isMobile = useIsMobile(); // Check if mobile

    // Hide sidebar visually on mobile, handled by MobileHeader
    if (isMobile) {
      return null;
    }

    return (
      <aside
        ref={ref}
        // Apply variants correctly based on props and context state
        className={cn(
            sidebarVariants({ side, variant, state, collapsible }),
            // Ensure it's hidden on mobile screens using Tailwind utility class
            "hidden md:flex", // hidden on mobile, flex on medium and up
            className
        )}
        data-state={state}
        data-collapsible={collapsible === 'icon' ? state : ''} // Simplified collapsible attribute
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children || <PanelLeft />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';


const SidebarInset = React.forwardRef<
  HTMLDivElement, // Changed back to div as main is in layout
  React.HTMLAttributes<HTMLDivElement> // Use HTMLAttributes for div
>(({ className, ...props }, ref) => {
   const { state } = useSidebar();
   const isMobile = useIsMobile();

   // Apply padding only on desktop and when sidebar is fixed
   const paddingClass = !isMobile ? (state === 'expanded' ? 'md:pl-[--sidebar-width]' : 'md:pl-[--sidebar-width-icon]') : '';

  return (
    <div // Changed from main to div
      ref={ref}
      className={cn(
         "flex-grow transition-[padding-left] duration-300 ease-in-out", // Adjusted transition property
         paddingClass, // Apply dynamic padding
         className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        'h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-ring', // Use standard ring color
        state === 'collapsed' && 'hidden', // Hide input when collapsed
        className
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex flex-col gap-1 p-2 shrink-0', className)} // Reduced gap
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-1 p-2 shrink-0', className)} // Reduced gap
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        'mx-2 w-auto bg-sidebar-border', // Use sidebar border color
        state === 'collapsed' && 'mx-auto w-4/5', // Center when collapsed
        className
      )}
      {...props}
    />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden', // Reduced gap, allow vertical scroll
        // state === 'collapsed' && 'items-center', // Center items when collapsed?
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';


const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-1', className)} // Reduced padding
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { state } = useSidebar();
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        // Use sidebar muted foreground color
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/60 outline-none ring-sidebar-ring transition-opacity ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        state === 'collapsed' && "opacity-0 h-0 p-0 overflow-hidden", // Hide label text when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { state } = useSidebar();
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        // Use sidebar colors
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        state === 'collapsed' && "hidden", // Hide action when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn('w-full text-sm', className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn('flex w-full min-w-0 flex-col gap-0.5', className)} // Reduced gap
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn('group/menu-item relative', className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

// Use sidebar theme variables for button variants
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding,color,background-color] duration-200 focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
  {
    variants: {
      variant: { // Use sidebar color variables
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline: 'border border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        secondary: 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80',
        ghost: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        link: 'text-sidebar-primary underline-offset-4 hover:underline',
      },
      size: { // Inherit sizes from standard button
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm',
        icon: 'h-8 w-8', // Adjust icon size if needed
      },
      state: { // Added state variant for collapsed styling
         expanded: "[&>span:last-child]:opacity-100 [&>span:last-child]:inline",
         collapsed: "justify-center !size-8 !p-0 [&>span:last-child]:opacity-0 [&>span:last-child]:hidden", // Center icon and hide text span
      }
    },
    defaultVariants: {
      variant: 'ghost', // Default to ghost for sidebar items
      size: 'default',
      state: 'expanded', // Default to expanded state
    },
  }
);


const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'ghost', // Default to ghost
      size = 'default',
      tooltip,
      className,
      children, // Ensure children are handled
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { state } = useSidebar(); // Get state from context

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        // Apply variants including the state variant
        className={cn(sidebarMenuButtonVariants({ variant, size, state }), className)}
        {...props}
      >
         {children}
      </Comp>
    );


    // Only show tooltip when collapsed and tooltip prop is provided
    if (!tooltip || state === 'expanded') {
      return buttonContent;
    }

    const tooltipContentProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right" align="center" {...tooltipContentProps} />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';


const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const { state } = useSidebar();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        // Use sidebar colors
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        state === 'collapsed' && 'hidden', // Hide action when collapsed
        showOnHover &&
          'opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
   const { state } = useSidebar();
   return (
     <div
       ref={ref}
       data-sidebar="menu-badge"
       className={cn(
         // Use sidebar colors
         "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
         "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
         "peer-data-[size=sm]/menu-button:top-1",
         "peer-data-[size=default]/menu-button:top-1.5",
         "peer-data-[size=lg]/menu-button:top-2.5",
          state === 'collapsed' && "hidden", // Hide badge when collapsed
         className
       )}
       {...props}
     />
   )
});
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const { state } = useSidebar();
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
       {state === 'expanded' && ( // Only show text skeleton when expanded
          <Skeleton
             className="h-4 flex-1 max-w-[--skeleton-width] bg-muted" // Use standard muted for skeleton
             data-sidebar="menu-skeleton-text"
             style={{ "--skeleton-width": width } as React.CSSProperties}
          />
       )}
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";


const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        // Use sidebar border color
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-sidebar-border px-2.5 py-0.5 transition-opacity duration-200',
         state === 'collapsed' && 'opacity-0 h-0 p-0 m-0 border-none overflow-hidden', // Hide sub-menu visually and from layout
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement, // Assuming it's used with <a> or Link
  React.ComponentProps<'a'> & {
    asChild?: boolean
    size?: 'sm' | 'md'
    isActive?: boolean
  }
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
   const Comp = asChild ? Slot : 'a'; // Or Link if using Next.js Link
   const { state } = useSidebar();

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        // Use sidebar colors
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        state === 'collapsed' && "hidden", // Hide sub-button when collapsed
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset, // May need adjustment or removal
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  // SidebarRail, // Removed
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
