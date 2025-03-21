
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Droplet, Loader2 } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  hospitalName: z.string().min(2, { message: 'Hospital name is required' }),
  donationDate: z.string().min(1, { message: 'Donation date is required' }),
  donationTime: z.string().min(1, { message: 'Donation time is required' }),
  additionalNotes: z.string().optional(),
});

type DonationFormValues = z.infer<typeof formSchema>;

interface DonateNowFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DonationFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const DonateNowForm = ({ open, onOpenChange, onSubmit, isSubmitting }: DonateNowFormProps) => {
  const { toast } = useToast();
  
  // Initialize the form
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: '',
      donationDate: new Date().toISOString().split('T')[0], // Default to today
      donationTime: '09:00', // Default time
      additionalNotes: '',
    },
  });

  const handleSubmit = async (values: DonationFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error submitting donation form:', error);
      toast({
        title: 'Error',
        description: 'Failed to register your donation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-primary" />
            Register for Blood Donation
          </DialogTitle>
          <DialogDescription>
            Provide details about where and when you'd like to donate blood.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital/Donation Center</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hospital or donation center name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="donationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requirements or health information..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Register Donation'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DonateNowForm;
