"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "./form/form-field"
import { Drawer } from "./drawer/drawer"
import { DrawerTrigger } from "./drawer/drawer-trigger"
import { DrawerContent } from "./drawer/drawer-content"
import { DrawerHeader } from "./drawer/drawer-header"
import { DrawerFooter } from "./drawer/drawer-footer"

interface FormData {
  name: string
  email: string
}

interface DrawerWithFormExampleProps {
  onSubmit?: (data: FormData) => void
  title?: string
  description?: string
}

export default function DrawerWithFormExample({
  onSubmit,
  title = "Form Drawer",
  description = "Fill out this form",
}: DrawerWithFormExampleProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData)
      }
      setIsSubmitting(false)
      setOpen(false)
      // Reset form
      setFormData({ name: "", email: "" })
    }, 1000)
  }

  return (
    <div className="p-4">
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger>Open Form Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader title={title} description={description} />

          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            <FormField id="name" label="Name" value={formData.name} onChange={handleInputChange} required />

            <FormField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <DrawerFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-cosmic-accent/20 text-cosmic-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
