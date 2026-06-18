"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonProps
  extends ButtonBaseProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button";
}

interface AnchorProps extends ButtonBaseProps {
  as: "a";
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

interface LinkProps extends ButtonBaseProps {
  as: "link";
  href: string;
  children: React.ReactNode;
}

type Props = ButtonProps | AnchorProps | LinkProps;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-champagne-gold text-lux-black hover:bg-antique-gold border border-champagne-gold",
  outline:
    "bg-transparent text-champagne-gold border border-champagne-gold hover:bg-champagne-gold hover:text-lux-black",
  ghost:
    "bg-transparent text-ivory border-transparent hover:text-champagne-gold",
  whatsapp:
    "bg-[#25D366] text-white border border-[#25D366] hover:bg-[#1ebe5d]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-6 py-3 text-sm tracking-widest",
  lg: "px-8 py-4 text-sm tracking-widest",
};

const base =
  "inline-flex items-center justify-center gap-2 font-sans uppercase tracking-widest transition-all duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[44px] min-w-[44px]";

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    variant = "outline",
    size = "md",
    className,
    ...rest
  } = props;

  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (props.as === "a") {
    const { as: _, variant: _v, size: _s, className: _c, ...aProps } = props as AnchorProps & { as: string; variant: Variant; size: Size; className: string };
    return <a className={classes} {...(aProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  if (props.as === "link") {
    const { as: _, variant: _v, size: _s, className: _c, href, children } = props as LinkProps & { variant: Variant; size: Size; className: string };
    return <Link href={href} className={classes}>{children}</Link>;
  }

  const { as: _, variant: _v, size: _s, className: _c, ...btnProps } = rest as ButtonProps & { as?: string; variant: Variant; size: Size; className: string };
  return <button ref={ref} className={classes} {...(btnProps as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
});

Button.displayName = "Button";
