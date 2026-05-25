"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { sendContactMail } from "@/actions/send-contact-email";
import { contactformSchema } from '@/lib/form-type';

export const ContactForm = () => {
    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof contactformSchema>>({
        resolver: zodResolver(contactformSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const sendEmail = async (values: z.infer<typeof contactformSchema>) => {
        try {
            setLoading(true);
            const res = await sendContactMail(values);
            setLoading(false);
            form.reset();
            if (res?.err) {
                return setErrorDialogOpen(true); 
            }
            setSuccessDialogOpen(true); 
        } catch (error) {
            setErrorDialogOpen(true); 
        }
    };

    function onSubmit(values: z.infer<typeof contactformSchema>) {
        sendEmail(values);
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-semibold text-zinc-300 dark:text-zinc-200">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            {...field}
                                            className="bg-white/5 dark:bg-black/35 border-white/10 dark:border-zinc-800/80 text-white placeholder-zinc-500 focus-visible:ring-primary focus-visible:border-primary focus:border-primary rounded-xl h-11 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />
                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-semibold text-zinc-300 dark:text-zinc-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...field}
                                            className="bg-white/5 dark:bg-black/35 border-white/10 dark:border-zinc-800/80 text-white placeholder-zinc-500 focus-visible:ring-primary focus-visible:border-primary focus:border-primary rounded-xl h-11 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Message field */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-sm font-semibold text-zinc-300 dark:text-zinc-200">Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="How can I help you?"
                                        {...field}
                                        className="bg-white/5 dark:bg-black/35 border-white/10 dark:border-zinc-800/80 text-white placeholder-zinc-500 focus-visible:ring-primary focus-visible:border-primary focus:border-primary rounded-xl min-h-[120px] transition-all duration-200"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-[#c98304] text-white hover:text-black dark:text-black font-semibold py-3 px-6 h-11 rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span>Send Message</span>
                                <Send className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            {/* Success Dialog */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="bg-zinc-950 border border-zinc-800/80 text-white max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-2xl">
                    <DialogHeader className="flex flex-col items-center justify-center pt-4">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                            <Check className="h-6 w-6 text-green-500 animate-bounce" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-center text-white">Email Sent Successfully</DialogTitle>
                    </DialogHeader>
                    <p className="text-zinc-400 text-sm text-center px-2 mt-2">
                        Thank you for reaching out! I&apos;ve received your message and will get back to you as soon as possible.
                    </p>
                    <DialogFooter className="sm:justify-center mt-6">
                        <Button 
                            onClick={() => setSuccessDialogOpen(false)}
                            className="bg-primary hover:bg-[#c98304] text-white dark:text-black font-semibold rounded-xl px-8 py-2 h-10 w-full sm:w-auto"
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={isErrorDialogOpen} onOpenChange={setErrorDialogOpen}>
                <DialogContent className="bg-zinc-950 border border-zinc-800/80 text-white max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-2xl">
                    <DialogHeader className="flex flex-col items-center justify-center pt-4">
                        <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                            <XCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-center text-white">Failed to Send Email</DialogTitle>
                    </DialogHeader>
                    <p className="text-zinc-400 text-sm text-center px-2 mt-2">
                        Something went wrong while sending your message. Please verify your details or try again later.
                    </p>
                    <DialogFooter className="sm:justify-center mt-6">
                        <Button 
                            onClick={() => setErrorDialogOpen(false)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl px-8 py-2 h-10 w-full sm:w-auto"
                        >
                            Try Again
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
