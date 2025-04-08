import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

interface DrawerHeaderProps {
  title: string
  description?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function DrawerHeader({
  title,
  description,
  titleClassName = "text-cosmic-text",
  descriptionClassName = "text-cosmic-muted",
}: DrawerHeaderProps){
  return (
    <SheetHeader>
      <SheetTitle className={titleClassName}>{title}</SheetTitle>
      {description && <SheetDescription className={descriptionClassName}>{description}</SheetDescription>}
    </SheetHeader>
  )
}
