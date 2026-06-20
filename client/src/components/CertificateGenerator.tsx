import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileDown, Loader2, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MultiChainPublisher from "./MultiChainPublisher";

export default function CertificateGenerator() {
  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    issuerName: "",
    date: "",
    notes: ""
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadPNG = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const link = document.createElement("a");
      link.download = `${formData.studentName || "certificate"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height] // Match canvas dimensions exactly
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${formData.studentName || "certificate"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 h-full">
      {/* Editor Side */}
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="edit">Edit Details</TabsTrigger>
                <TabsTrigger value="publish">Publish On-Chain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-6">
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input 
                    id="studentName" 
                    name="studentName"
                    placeholder="e.g. Jane Doe" 
                    value={formData.studentName}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="courseName">Course Title</Label>
                    <Input 
                    id="courseName" 
                    name="courseName"
                    placeholder="e.g. Advanced Blockchain" 
                    value={formData.courseName}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="issuerName">Issued By</Label>
                    <Input 
                    id="issuerName" 
                    name="issuerName"
                    placeholder="e.g. CertifyChain Academy" 
                    value={formData.issuerName}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date of Issue</Label>
                    <Input 
                    id="date" 
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                    id="notes" 
                    name="notes"
                    placeholder="Optional remarks..." 
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                <Button 
                    variant="outline" 
                    onClick={downloadPNG} 
                    disabled={isGenerating}
                    className="w-full"
                >
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Save as PNG
                </Button>
                <Button 
                    onClick={downloadPDF} 
                    disabled={isGenerating}
                    className="w-full"
                >
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    Save as PDF
                </Button>
                </div>
            </TabsContent>

            <TabsContent value="publish">
                <MultiChainPublisher certificateData={formData} />
            </TabsContent>
        </Tabs>
      </div>

      {/* Preview Side */}
      <div className="lg:col-span-3 bg-muted/30 rounded-xl border flex items-center justify-center p-4 lg:p-8 overflow-hidden relative group min-h-[500px]">
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
         
         <div className="transform transition-transform duration-500 hover:scale-[1.01] shadow-2xl">
            {/* Certificate Template */}
            <div 
              ref={certificateRef}
              id="certificate-preview"
              className="w-[800px] h-[600px] bg-white relative flex flex-col text-center p-16 border-[16px] border-double border-slate-100 shadow-sm"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(248,250,252,1) 100%)"
              }}
            >
                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary/20 rounded-tl-3xl"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary/20 rounded-tr-3xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-primary/20 rounded-bl-3xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary/20 rounded-br-3xl"></div>

                {/* Content */}
                <div className="flex-grow flex flex-col items-center justify-center space-y-8 relative z-10">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-serif font-bold text-primary tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Certificate
                        </h1>
                        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium">of Completion</p>
                    </div>

                    <div className="w-full space-y-6 py-8">
                        <p className="text-lg text-muted-foreground italic font-serif">This certifies that</p>
                        
                        <div className="border-b-2 border-primary/10 pb-2 w-3/4 mx-auto">
                            <h2 className="text-4xl font-bold text-slate-800 font-heading">
                                {formData.studentName || "Student Name"}
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground italic font-serif">has successfully completed the course</p>

                        <div className="border-b-2 border-primary/10 pb-2 w-3/4 mx-auto">
                            <h3 className="text-3xl font-semibold text-primary/90">
                                {formData.courseName || "Course Title"}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-12 pt-12 mt-auto">
                        <div className="text-center space-y-2">
                            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
                                <p className="font-semibold text-slate-800">{formData.date || "YYYY-MM-DD"}</p>
                            </div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Date Issued</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
                                <p className="font-semibold text-slate-800">{formData.issuerName || "Organization Name"}</p>
                            </div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Issued By</p>
                        </div>
                    </div>

                    {formData.notes && (
                        <div className="absolute bottom-4 text-xs text-muted-foreground/50 italic max-w-md">
                            {formData.notes}
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
