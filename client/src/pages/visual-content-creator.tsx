
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { Image, Palette, Download, Eye, Upload, Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function VisualContentCreator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const imageStyles = [
    "Photorealistic", "Digital Art", "Minimalist", "Vintage", 
    "Corporate", "Artistic", "Hand-drawn", "Abstract"
  ];

  const dimensionOptions = [
    { label: "Square (1:1)", value: "1024x1024", desc: "Perfect for Instagram posts" },
    { label: "Portrait (4:5)", value: "819x1024", desc: "Instagram stories" },
    { label: "Landscape (16:9)", value: "1024x576", desc: "YouTube thumbnails" },
    { label: "Twitter Header", value: "1500x500", desc: "Twitter banner" }
  ];

  const templates = [
    { id: "quote", name: "Quote Post", category: "Social" },
    { id: "announcement", name: "Announcement", category: "Business" },
    { id: "promotion", name: "Promotion", category: "Marketing" },
    { id: "infographic", name: "Infographic", category: "Educational" }
  ];

  const generateImageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to generate image");
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedImages(data.images || []);
    },
  });

  const enhanceImageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/ai/enhance-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to enhance image");
      return response.json();
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    generateImageMutation.mutate({
      prompt,
      style,
      dimensions,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to use the Visual Content Creator.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Image className="w-8 h-8 mr-3 text-blue-600" />
            Visual Content Creator
          </h1>
          <p className="text-gray-600">Create stunning visuals for your social media posts with AI.</p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">AI Image Generation</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="enhance">Image Enhancement</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Generation Controls */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Generation</CardTitle>
                    <CardDescription>Describe the image you want to create</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">Image Description</Label>
                      <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A professional businesswoman presenting to a team in a modern office..."
                        className="w-full p-3 border rounded-md resize-none h-24 mt-1"
                      />
                    </div>

                    <div>
                      <Label>Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {imageStyles.map(styleOption => (
                            <SelectItem key={styleOption} value={styleOption.toLowerCase()}>
                              {styleOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Dimensions</Label>
                      <Select value={dimensions} onValueChange={setDimensions}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select dimensions" />
                        </SelectTrigger>
                        <SelectContent>
                          {dimensionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.desc}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || generateImageMutation.isPending}
                      className="w-full"
                    >
                      {generateImageMutation.isPending ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Images */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedImages.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {generatedImages.map((image, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <img 
                              src={image.url} 
                              alt={`Generated image ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => downloadImage(image.url, `generated-image-${index + 1}.png`)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Generate your first AI image by describing what you want to create</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Templates</CardTitle>
                <CardDescription>Choose from pre-designed templates for quick content creation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Upload an image to enhance or modify</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Click to upload an image</p>
                    </label>
                  </div>

                  {uploadedImage && (
                    <div className="mt-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-4 space-y-2">
                        <Button variant="outline" className="w-full">
                          Enhance Quality
                        </Button>
                        <Button variant="outline" className="w-full">
                          Remove Background
                        </Button>
                        <Button variant="outline" className="w-full">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhancement Options</CardTitle>
                  <CardDescription>Choose how to improve your image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Wand2 className="w-4 h-4 mr-2" />
                      AI Upscaling
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Palette className="w-4 h-4 mr-2" />
                      Color Correction
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Noise Reduction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
