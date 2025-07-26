"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// Option 1: Modified Avatar with better object-fit options
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{
        objectPosition: 'center',
        objectFit: "contain",
      }}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full ",
        "p-auto", // add padding for logos
        className
      )}
      style={{
        objectFit: "contain",
        objectPosition: 'center',
      }}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

// Option 2: Specialized LogoAvatar component
function LogoAvatar({
  className,
  src,
  alt,
  fallback,
  ...props
}: {
  className?: string
  src?: string
  alt?: string
  fallback?: React.ReactNode
} & Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, 'children'>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-lg", // rounded-lg instead of rounded-full
        "bg-white border border-gray-200", // white background for logos
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square size-full p-1" // padding to prevent cropping
        style={{
          objectFit: 'contain', // contain instead of cover
          objectPosition: 'center',
        }}
      />
      <AvatarPrimitive.Fallback className="bg-gray-50 flex size-full items-center justify-center rounded-lg">
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

// Option 3: Adaptive Avatar that detects logo vs profile image
function AdaptiveAvatar({
  className,
  src,
  alt,
  fallback,
  isLogo = false, // explicitly mark as logo
  ...props
}: {
  className?: string
  src?: string
  alt?: string
  fallback?: React.ReactNode
  isLogo?: boolean
} & Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, 'children'>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden",
        isLogo ? "rounded-lg bg-white border border-gray-200" : "rounded-full",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className={cn(
          "aspect-square size-full",
          isLogo && "p-1" // padding for logos
        )}
        style={{
          objectFit: isLogo ? 'contain' : 'cover',
          objectPosition: 'center',
        }}
      />
      <AvatarPrimitive.Fallback 
        className={cn(
          "flex size-full items-center justify-center",
          isLogo ? "bg-gray-50 rounded-lg" : "bg-muted rounded-full"
        )}
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export { Avatar, AvatarImage, AvatarFallback, LogoAvatar, AdaptiveAvatar }