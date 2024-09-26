"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import  { z } from "zod";
import {LoaderCircle} from 'lucide-react'
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { sendContactMail } from "@/actions/send-contact-email";
import { contactformSchema } from '@/lib/form-type'
// Define the validation schema using Zod

// ProfileForm component
export const ContactForm = () => {
    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [loading,setLoading] = useState(false)
    // Initialize the form using the schema
    const form = useForm<z.infer<typeof contactformSchema>>({
        resolver: zodResolver(contactformSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    // Simulate an API request for sending an email
    const sendEmail = async (values: z.infer<typeof contactformSchema>) => {
        try {
            setLoading(true)
            const res = await sendContactMail(values)
            setLoading(false)
            if (res?.err) {
                return setErrorDialogOpen(true); 
            }
            setSuccessDialogOpen(true); 
        } catch (error) {
            setErrorDialogOpen(true); 
        }
    };

    // Define the submit handler
    function onSubmit(values: z.infer<typeof contactformSchema>) {
        sendEmail(values);
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            {...field}
                                            className="dark:text-gray-100 dark:border-gray-700"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...field}
                                            className="dark:text-gray-100 dark:border-gray-700"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Message field */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="How can I help you?"
                                        {...field}
                                        className="dark:text-gray-100 dark:border-gray-700"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="dark:bg-primary w-full dark:text-black bg-primary dark:hover:scale-[1.01] transition-all duration-200"
                    >
                        {loading?<LoaderCircle className="h-8 w-8 animate-spin" />:'Submit'}
                    </Button>
                </form>
            </Form>

            {/* Success Dialog */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Email Sent Successfully</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setSuccessDialogOpen(false)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={isErrorDialogOpen} onOpenChange={setErrorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Failed to Send Email</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setErrorDialogOpen(false)}>Try Again</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
