"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MusicIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formSchema } from "./constants";

import { Heading } from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import axios from "axios";

import { useProModel } from "@/hooks/use-pro-model";

const MusicPage = () => {
  const proModel = useProModel();
  const router = useRouter();
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      genre: "90's rap",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/music", {
        prompt: values.prompt,
        genre: values.genre,
      });

      setMusic(response.data.audio);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403){
        proModel.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Generate music content using AI."
        icon={MusicIcon}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-9 focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Generate a music track"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-slate-200">
              <Loader />
            </div>
          )}
          {!music && !isLoading && (
            <Empty label="No music generated." />
          )}
          {music && (
            <audio
              controls
              className={cn("w-full mt-8", isLoading && "opacity-50")}
            >
              <source src={music} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
