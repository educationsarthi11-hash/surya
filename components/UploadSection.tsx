

import React, { useState, useRef } from 'react';
import { UserRole } from '../types';
import { analyzeImageAndGetJson, sanitizeHtml } from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon, SparklesIcon, CameraIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { Type } from '@google/genai';

interface UploadSectionProps {
  role: UserRole;
}

const UploadSection: React.FC<UploadSectionProps> = ({ role }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const toast = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const config = {
    [UserRole.Student]: {
      title: 'Upload Homework',
      description: 'Upload your homework (image) for AI feedback.',
      prompt: 'This is a student\'s homework. Provide feedback in JSON format with two keys: "positiveFeedback" (a string praising what was done well) and "areasForImprovement" (a string with 2-3 constructive suggestions). Be encouraging.',
      action: 'Get Feedback',
      schema: {
        type: Type.OBJECT,
        properties: {
            positiveFeedback: { type: Type.STRING, description: "Encouraging feedback on what the student did well." },
            areasForImprovement: { type: Type.STRING, description: "Constructive suggestions for improvement." }
        },
        required: ["positiveFeedback", "areasForImprovement"]
      },
      formatResult: (res: any) => `Positive Feedback:\n${res.positiveFeedback}\n\nAreas for Improvement:\n${res.areasForImprovement}`
    },
    [UserRole.Teacher]: {
      title: 'Upload Materials',
      description: 'Upload class notes (image) for an AI-generated summary.',
      prompt: 'Summarize the key points from these class notes in JSON format. Provide a "title" for the lesson and a "summaryPoints" key which is an array of strings, with each string being a key takeaway.',
      action: 'Generate Summary',
      schema: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A suitable title for the lesson notes." },
            summaryPoints: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of key summary points from the notes."
            }
        },
        required: ["title", "summaryPoints"]
      },
      formatResult: (res: any) => `Lesson Title: ${res.title}\n\nKey Takeaways:\n- ${res.summaryPoints.join('\n- ')}`
    },
    [UserRole.Admin]: {
      title: 'Monitor Uploads',
      description: 'Review uploaded content for appropriateness.',
      prompt: 'Analyze this image for a school environment. Provide a JSON response with three keys: "description" (a brief string describing the image), "isAppropriate" (a boolean, true if the content is suitable for all ages), and "concerns" (a string explaining any potential issues if inappropriate).',
      action: 'Analyze Content',
      schema: {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "A brief, objective description of the image content." },
            isAppropriate: { type: Type.BOOLEAN, description: "Whether the content is appropriate for a school environment." },
            concerns: { type: Type.STRING, description: "A brief explanation of any concerns if the content is not appropriate. Empty if appropriate." }
        },
        required: ["description", "isAppropriate", "concerns"]
      },
      formatResult: (res: any) => `Description: ${res.description}\nAppropriate: ${res.isAppropriate ? 'Yes' : 'No'}\n\nConcerns:\n${res.concerns || 'None'}`
    },
    [UserRole.Parent]: {
      title: 'Review Child\'s Work',
      description: 'Upload your child\'s homework to get AI-powered feedback on their progress.',
      prompt: 'This is a student\'s homework submitted by a parent. Review it and provide feedback in JSON format with "strengths" (string) and "suggestions" (string) keys. The tone should be helpful and professional, addressed to the parent.',
      action: 'Analyze Work',
      schema: {
        type: Type.OBJECT,
        properties: {
            strengths: { type: Type.STRING, description: "A summary of the strengths shown in the homework." },
            suggestions: { type: Type.STRING, description: "Actionable suggestions for the parent to help the child improve." }
        },
        required: ["strengths", "suggestions"]
      },
      formatResult: (res: any) => `Strengths Noted:\n${res.strengths}\n\nSuggestions for Home:\n${res.suggestions}`
    }
  };

  const currentConfig = config[role];

  const handleOpenCamera = async () => {
    if (isCameraOpen) {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsCameraOpen(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            toast.error("Camera access denied. Please allow it in your browser settings.");
            console.error("Camera access error:", err);
        }
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(blob => {
            if (blob) {
                const newFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                setFile(newFile);
                handleOpenCamera(); // Close camera
            }
        }, 'image/jpeg');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResult('');
    }
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const response = await analyzeImageAndGetJson(currentConfig.prompt, file, currentConfig.schema);
      
      const formattedResult = currentConfig.formatResult(response);
      setResult(formattedResult);

    } catch (err) {
      console.error(err);
      toast.error('Failed to process the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {isCameraOpen && (
            <div className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center p-4">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-lg mb-4" aria-label="Camera preview"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <div className="flex gap-4">
                    <button onClick={handleTakePhoto} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg">Take Photo</button>
                    <button onClick={handleOpenCamera} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-lg">Close</button>
                </div>
            </div>
        )}
      <div className="flex items-center mb-4">
        <UploadIcon className="h-8 w-8 text-primary" />
        <h2 className="ml-3 text-2xl font-bold text-neutral-900">{currentConfig.title}</h2>
      </div>
      <p className="text-sm text-neutral-600 mb-4">{currentConfig.description}</p>
      
      <div className="flex flex-col items-center p-6 border-2 border-dashed border-neutral-300 rounded-lg">
        <UploadIcon className="h-10 w-10 text-neutral-400" />
        <div className="flex items-center gap-4 mt-2">
            <label htmlFor={`file-upload-${role}`} className="text-sm font-medium text-primary cursor-pointer hover:underline">
              {file ? file.name : 'Select a file'}
              <input id={`file-upload-${role}`} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" />
            </label>
            <span className="text-sm text-neutral-400">OR</span>
            <button type="button" onClick={handleOpenCamera} className="text-sm font-medium text-primary cursor-pointer hover:underline flex items-center gap-1">
                <CameraIcon className="h-4 w-4" /> Take Photo
            </button>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Image or PDF up to 10MB</p>
      </div>

      <button onClick={handleProcess} disabled={loading || !file} className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
        <SparklesIcon className="h-5 w-5 mr-2" />
        {loading ? 'Processing...' : currentConfig.action}
      </button>

      {loading && <div className="mt-4"><Loader message="AI is working..." /></div>}
      
      {result && (
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
          <h3 className="font-semibold text-neutral-800">AI Result:</h3>
          <p className="text-sm text-neutral-600 mt-2 whitespace-pre-wrap">{sanitizeHtml(result)}</p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;