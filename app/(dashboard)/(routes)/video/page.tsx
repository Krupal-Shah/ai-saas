"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VideoIcon } from "lucide-react";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formSchema, widthOptions, heightOptions } from "./constants";

import { Heading } from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import axios from "axios";

import { useProModel } from "@/hooks/use-pro-model";

const VideoPage = () => {
  const proModel = useProModel();
  const router = useRouter();
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      width: "1024",
      height: "1024",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/video", {
        prompt: values.prompt,
        width: values.width,
        height: values.height,
      });

      setVideo(response.data.video);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403){
        proModel.onOpen();
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Create high quality video using text prompts."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-9 focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Generate a video of a horse on a beach"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name='width'
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value} 
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value.toString()}/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {widthOptions.map((option) => (
                          <SelectItem 
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}  
                          </SelectItem>
                        ))}
                      </SelectContent>
                      
                    </Select>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name='height'
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value} 
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value.toString()}/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {heightOptions.map((option) => (
                          <SelectItem 
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}  
                          </SelectItem>
                        ))}
                      </SelectContent>
                      
                    </Select>
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
          {!video && !isLoading && <Empty label="No Image generated." />}
          {video && (
            <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
