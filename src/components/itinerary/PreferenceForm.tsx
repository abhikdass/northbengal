import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Calendar, DollarSign, Tag } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  destination: z.string().min(1, { message: "Please select a destination" }),
  duration: z.number().min(1).max(30),
  budget: z.number().min(1000).max(100000),
  startDate: z.string().min(1, { message: "Please select a start date" }),
  interests: z
    .array(z.string())
    .min(1, { message: "Select at least one interest" }),
});

interface PreferenceFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
}

const PreferenceForm = ({ onSubmit = () => {} }: PreferenceFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      duration: 5,
      budget: 20000,
      startDate: "",
      interests: [],
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const interestOptions = [
    { id: "wildlife", label: "Wildlife" },
    { id: "heritage", label: "Heritage Sites" },
    { id: "adventure", label: "Adventure Sports" },
    { id: "nature", label: "Nature & Landscapes" },
    { id: "culture", label: "Local Culture" },
    { id: "food", label: "Culinary Experiences" },
    { id: "photography", label: "Photography" },
    { id: "trekking", label: "Trekking" },
  ];

  const destinationOptions = [
    { value: "darjeeling", label: "Darjeeling" },
    { value: "kalimpong", label: "Kalimpong" },
    { value: "dooars", label: "Dooars" },
    { value: "siliguri", label: "Siliguri" },
    { value: "kurseong", label: "Kurseong" },
    { value: "mirik", label: "Mirik" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Your Perfect Itinerary
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Destination Selection */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Destination
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {destinationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the main destination for your North Bengal trip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trip Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Trip Duration (days)
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        1 day
                      </span>
                      <span className="text-sm font-medium">
                        {field.value} days
                      </span>
                      <span className="text-sm text-muted-foreground">
                        30 days
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Select how many days you plan to spend in North Bengal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget Range */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Budget (₹)
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={1000}
                      max={100000}
                      step={1000}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        ₹1,000
                      </span>
                      <span className="text-sm font-medium">
                        ₹{field.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ₹100,000
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Set your approximate budget for the entire trip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Start Date
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  When do you plan to start your journey?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interests */}
          <FormField
            control={form.control}
            name="interests"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Interests
                  </FormLabel>
                  <FormDescription>
                    Select activities and experiences you're interested in.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {interestOptions.map((interest) => (
                    <FormField
                      key={interest.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        interest.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== interest.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {interest.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Generate Itinerary
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PreferenceForm;
