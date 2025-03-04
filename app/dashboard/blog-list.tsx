'use client'

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from "@/utils/api";  // Add this import

// interface BlogFormData {
//   theme: string
//   description: string
//   numberOfBlogs: number
//   writingStyle: string
// }

// export default function BlogGeneratorButton() {
//   const [open, setOpen] = useState(false)
//   const form = useForm<BlogFormData>()

//   const onSubmit = (data: BlogFormData) => {
//     console.log(data)
//     setOpen(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="secondary">Generate New Blogs</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Generate Blog Posts</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="theme"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Blog Theme</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter blog theme..." {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea 
//                       placeholder="Enter blog description..." 
//                       {...field} 
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="numberOfBlogs"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Number of Blogs</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="number" 
//                       min={1} 
//                       max={10} 
//                       {...field} 
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="writingStyle"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Writing Style</FormLabel>
//                   <Select 
//                     onValueChange={field.onChange} 
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a style" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="casual">Casual</SelectItem>
//                       <SelectItem value="formal">Formal</SelectItem>
//                       <SelectItem value="technical">Technical</SelectItem>
//                       <SelectItem value="creative">Creative</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Generate</Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }


const BlogList = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [numBlogs, setNumBlogs] = useState('');
  const [writingStyle, setWritingStyle] = useState('');

  // Uncomment and use this if you need form hook
  // const form = useForm();

  const getTopics = api.blog.getTopics.useMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getTopics.mutate({
      projectId,
      theme,
      description,
      numTopics:parseInt(numBlogs),
      style:writingStyle
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Generate New Blogs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Blog Posts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label>Blog Theme</label>
            <Input 
              placeholder="Enter blog theme..." 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label>Description</label>
            <Textarea
              placeholder="Enter blog description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label>Number of Blogs</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={numBlogs}
              onChange={(e) => setNumBlogs(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label>Writing Style</label>
            <Select
              value={writingStyle}
              onValueChange={setWritingStyle}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Generate</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogList;