"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";

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
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import axios from "axios";

import { useProModel } from "@/hooks/use-pro-model";


const ImagePage = () => {
  const proModel = useProModel();
  const router = useRouter();
  const [image, setImage] = useState<string>();
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
      const response = await axios.post("/api/image", {
        prompt: values.prompt,
        width: values.width,
        height: values.height,
      });

      setImage(response.data.image);
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
        title="Image Generation"
        description="Create high quality images using text prompts."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                        placeholder="Generate an image"
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
          {!image && !isLoading && <Empty label="No Image generated." />}
          {image && (
            <Card
            key={image}
            className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image alt='Image' fill src={image}></Image>
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => window.open(image)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2"/> Download
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
