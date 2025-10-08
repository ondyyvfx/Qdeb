"use client"

import Navbar from "@/components/shared/Navbar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface RegistrationField {
  name: string
  type: "TEXT" | "EMAIL" | "PHONE" | "NUMBER" | "DATE" | "DESCRIPTION"
  required: boolean
}

interface FormData {
  name: string
  slug: string
  organizerName: string
  organizerContance: string
  description: string
  date: string
  active: boolean
  fee: number
  level: "LOCAL" | "REGIONAL" | "NATIONAL" | "INTERNATIONAL"
  format: "online" | "offline" | "hybrid"
  seq: number
  registraionFields: RegistrationField[]
}

export default function RegistrationFormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    organizerName: "",
    organizerContance: "",
    description: "",
    date: "",
    active: true,
    fee: 0,
    level: "LOCAL",
    format: "online",
    seq: 1,
    registraionFields: [
      {
        name: "Full Name",
        type: "TEXT",
        required: true,
      },
    ],
  })

  const [registrationFields, setRegistrationFields] = useState<
    RegistrationField[]
  >([
    {
      name: "Full Name",
      type: "TEXT",
      required: true,
    },
  ])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRegistrationFieldChange = (
    index: number,
    field: keyof RegistrationField,
    value: any
  ) => {
    const updatedFields = registrationFields.map((fieldItem, i) =>
      i === index ? { ...fieldItem, [field]: value } : fieldItem
    )
    setRegistrationFields(updatedFields)
    setFormData((prev) => ({
      ...prev,
      registraionFields: updatedFields,
    }))
  }

  const addRegistrationField = () => {
    const newField: RegistrationField = {
      name: "",
      type: "TEXT",
      required: false,
    }
    const updatedFields = [...registrationFields, newField]
    setRegistrationFields(updatedFields)
    setFormData((prev) => ({
      ...prev,
      registraionFields: updatedFields,
    }))
  }

  const removeRegistrationField = (index: number) => {
    const updatedFields = registrationFields.filter((_, i) => i !== index)
    setRegistrationFields(updatedFields)
    setFormData((prev) => ({
      ...prev,
      registraionFields: updatedFields,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Tournament Registration Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Tournament Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-white mb-1">
                  Tournament Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter tournament name"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-white mb-1">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="tournament-slug"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="organizerName" className="text-white mb-1">
                  Organizer Name
                </Label>
                <Input
                  id="organizerName"
                  value={formData.organizerName}
                  onChange={(e) =>
                    handleInputChange("organizerName", e.target.value)
                  }
                  placeholder="Enter organizer name"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="organizerContance" className="text-white mb-1">
                  Organizer Contact
                </Label>
                <Input
                  id="organizerContance"
                  type="email"
                  value={formData.organizerContance}
                  onChange={(e) =>
                    handleInputChange("organizerContance", e.target.value)
                  }
                  placeholder="organizer@email.com"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white mb-1">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your tournament..."
                rows={4}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="date" className="text-white mb-1">
                  Tournament Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="fee" className="text-white mb-1">
                  Registration Fee
                </Label>
                <Input
                  id="fee"
                  type="number"
                  value={formData.fee}
                  onChange={(e) =>
                    handleInputChange("fee", Number(e.target.value))
                  }
                  placeholder="0"
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="seq" className="text-white mb-1">
                  Sequence Number
                </Label>
                <Input
                  id="seq"
                  type="number"
                  value={formData.seq}
                  onChange={(e) =>
                    handleInputChange("seq", Number(e.target.value))
                  }
                  placeholder="1"
                  min="1"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="level" className="text-white mb-1">
                  Tournament Level
                </Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                >
                  <option value="LOCAL">Local</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="NATIONAL">National</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              <div>
                <Label htmlFor="format" className="text-white mb-1">
                  Tournament Format
                </Label>
                <select
                  id="format"
                  value={formData.format}
                  onChange={(e) => handleInputChange("format", e.target.value)}
                  className="w-full p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  handleInputChange("active", checked)
                }
              />
              <Label htmlFor="active" className="text-white mb-1">
                Tournament is Active
              </Label>
            </div>

            {/* Dynamic Registration Fields */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Registration Fields
                </h3>
                <Button
                  type="button"
                  onClick={addRegistrationField}
                  variant="outline"
                  className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                >
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {registrationFields.map((field, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label
                          htmlFor={`field-name-${index}`}
                          className="text-white mb-1"
                        >
                          Field Name
                        </Label>
                        <Input
                          id={`field-name-${index}`}
                          value={field.name}
                          onChange={(e) =>
                            handleRegistrationFieldChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Field name"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`field-type-${index}`}
                          className="text-white mb-1"
                        >
                          Field Type
                        </Label>
                        <select
                          id={`field-type-${index}`}
                          value={field.type}
                          onChange={(e) =>
                            handleRegistrationFieldChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                        >
                          <option value="TEXT">Text</option>
                          <option value="EMAIL">Email</option>
                          <option value="PHONE">Phone</option>
                          <option value="NUMBER">Number</option>
                          <option value="DATE">Date</option>
                          <option value="DESCRIPTION">Description</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-required-${index}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            handleRegistrationFieldChange(
                              index,
                              "required",
                              checked
                            )
                          }
                        />
                        <Label
                          htmlFor={`field-required-${index}`}
                          className="text-white mb-1"
                        >
                          Required
                        </Label>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => removeRegistrationField(index)}
                          variant="outline"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          disabled={registrationFields.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 hover:bg-blue-700 border-0"
              >
                Create Tournament
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
