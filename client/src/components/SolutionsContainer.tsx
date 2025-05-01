import { useState } from "react";
import { 
  FaUserTie, 
  FaComments, 
  FaUsers, 
  FaGraduationCap, 
  FaTools, 
  FaUserPlus, 
  FaPaperPlane, 
  FaPlayCircle, 
  FaExternalLinkAlt, 
  FaChevronDown, 
  FaChevronRight, 
  FaThumbsUp, 
  FaComment, 
  FaMapMarkerAlt, 
  FaArrowRight,
  FaCheck,
  FaLightbulb,
  FaClipboardList,
  FaAngleDown,
  FaAngleUp,
  FaNetworkWired,
  FaThumbsDown,
  FaRobot,
  FaEnvelope,
  FaClipboard,
  FaCreditCard,
  FaSpinner
} from "react-icons/fa";
import AgentMarketplace from "./AgentMarketplace";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { 
  SolutionResponse, 
  ProcessStep, 
  ConsultInAction, 
  ConsultInEmailAction, 
  ConsultInFormAction, 
  ConsultInProductAction 
} from "@shared/schema";

interface SolutionsContainerProps {
  solution: SolutionResponse;
}



const StepCard = ({ step, index }: { step: ProcessStep; index: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  // Set ConsultIn as the default active tab if it exists
  const [activeTab, setActiveTab] = useState<string | undefined>(
    step.consultInAction ? "consultin" : undefined
  );
  const [showConsultInDialog, setShowConsultInDialog] = useState(false);
  const [isConsultInThinking, setIsConsultInThinking] = useState(false);
  const [showConsultInAction, setShowConsultInAction] = useState(false);
  
  // Determine which resource tabs to show
  const tabs = [];
  
  // Add ConsultIn tab as the first tab if there's a consultInAction
  if (step.consultInAction) {
    tabs.push({ id: "consultin", name: "ConsultIn", icon: FaRobot });
  }
  
  // Add other resource tabs
  if (step.resources?.experts && step.resources.experts.length > 0) {
    tabs.push({ id: "experts", name: "Experts", icon: FaUserTie });
  }
  if (step.resources?.conversations && step.resources.conversations.length > 0) {
    tabs.push({ id: "conversations", name: "Conversations", icon: FaComments });
  }
  if (step.resources?.talents && step.resources.talents.length > 0) {
    tabs.push({ id: "talent", name: "Talent", icon: FaUsers });
  }
  if (step.resources?.trainings && step.resources.trainings.length > 0) {
    tabs.push({ id: "training", name: "Training", icon: FaGraduationCap });
  }
  if (step.resources?.services && step.resources.services.length > 0) {
    tabs.push({ id: "services", name: "Services", icon: FaTools });
  }
  
  // Handle ConsultIn button click
  const handleConsultInClick = () => {
    setIsConsultInThinking(true);
    setTimeout(() => {
      setIsConsultInThinking(false);
      setShowConsultInAction(true);
    }, 2000); // Simulate "thinking" for 2 seconds
  };
  
  // Handle agent installation from marketplace
  const handleInstallAgent = (agentId: number) => {
    setShowConsultInDialog(false);
    
    // After a brief pause, show the ConsultIn action (as if the agent completed the task)
    setTimeout(() => {
      setIsConsultInThinking(false);
      setShowConsultInAction(true);
    }, 1000);
  };

  return (
    <div className="mb-4 border border-[#e0e0e0] rounded-lg overflow-hidden bg-white">
      <div 
        className={`p-4 flex items-center ${isOpen ? 'border-b border-[#e0e0e0]' : ''} cursor-pointer hover:bg-[#f3f2ef]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold">{step.title}</h3>
        </div>
        <div className="text-[#0a66c2]">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1 flex items-center">
              <FaClipboardList className="mr-2 text-[#0a66c2]" /> What to do:
            </h4>
            <p className="text-sm ml-6">{step.description}</p>
          </div>
          
          <div className="mb-4 bg-[#f3f9f1] p-3 rounded">
            <h4 className="font-semibold text-sm mb-1 flex items-center">
              <FaLightbulb className="mr-2 text-[#39a845]" /> Solution:
            </h4>
            <p className="text-sm ml-6">{step.solution}</p>
          </div>
          
          {/* Network Comments Section */}
          {step.networkComments && step.networkComments.length > 0 && (
            <div className="mb-4 border rounded p-3">
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <FaNetworkWired className="mr-2 text-[#0a66c2]" /> People in your network commenting on this step:
              </h4>
              
              <div className="space-y-3 ml-2">
                {step.networkComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-2 rounded ${
                      comment.sentiment === 'positive' ? 'bg-[#f3f9f1] border-l-2 border-green-500' : 
                      comment.sentiment === 'negative' ? 'bg-[#fff9f9] border-l-2 border-red-500' :
                      'bg-[#f9f9f9] border-l-2 border-gray-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <img
                        src={comment.authorImage}
                        alt={comment.authorName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="ml-2 flex-1">
                        <div className="flex items-center">
                          <h5 className="font-semibold text-xs">{comment.authorName}</h5>
                          {comment.sentiment === 'positive' && (
                            <span className="ml-2 text-green-600 text-xs flex items-center">
                              <FaThumbsUp className="mr-1" size={10} /> Agrees
                            </span>
                          )}
                          {comment.sentiment === 'negative' && (
                            <span className="ml-2 text-red-600 text-xs flex items-center">
                              <FaThumbsDown className="mr-1" size={10} /> Disagrees
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{comment.authorTitle} • {comment.authorCompany}</p>
                        <p className="text-xs mt-1">{comment.content}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{comment.postedTime}</span>
                          <span className="ml-2"><FaThumbsUp className="inline mr-1" size={10} /> {comment.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tabs.length > 0 && (
            <div className="border-t border-[#e0e0e0] pt-3 mt-3">
              <h4 className="font-semibold text-sm mb-2">Resources for this step:</h4>
              
              <div className="mb-3">
                <ul className="flex flex-wrap -mb-px text-sm">
                  {tabs.map((tab) => (
                    <li key={tab.id} className="mr-1">
                      <button 
                        onClick={() => setActiveTab(activeTab === tab.id ? undefined : tab.id)}
                        className={`tab-item text-xs py-1 ${activeTab === tab.id ? 'active' : ''}`}
                      >
                        <tab.icon className="mr-1 inline" /> {tab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {activeTab === "experts" && step.resources?.experts && (
                <div className="pl-2">
                  {step.resources.experts.map((expert) => (
                    <div key={expert.id} className="flex items-center p-2 mb-2 border-b border-dashed border-[#e0e0e0]">
                      <img 
                        src={expert.profileImage || ''} 
                        alt={expert.name} 
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                      <div className="ml-2 flex-1">
                        <h4 className="font-semibold text-sm">{expert.name}</h4>
                        <p className="text-xs text-[#666666]">{expert.title} • {expert.company}</p>
                      </div>
                      <button className="ml-2 bg-white border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] px-2 py-1 rounded-full text-xs font-semibold">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "conversations" && step.resources?.conversations && (
                <div className="pl-2">
                  {step.resources.conversations.map((conversation) => (
                    <div key={conversation.id} className="p-2 mb-2 border-b border-dashed border-[#e0e0e0]">
                      <div className="flex items-center mb-1">
                        <img 
                          src={conversation.authorImage || ''} 
                          alt={conversation.authorName} 
                          className="h-6 w-6 rounded-full object-cover" 
                        />
                        <div className="ml-1">
                          <h4 className="font-semibold text-xs">{conversation.authorName}</h4>
                        </div>
                      </div>
                      <p className="text-xs mb-1">{conversation.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "talent" && step.resources?.talents && (
                <div className="pl-2">
                  {step.resources.talents.map((talent) => (
                    <div key={talent.id} className="flex items-center p-2 mb-2 border-b border-dashed border-[#e0e0e0]">
                      <img 
                        src={talent.profileImage || ''} 
                        alt={talent.name} 
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                      <div className="ml-2 flex-1">
                        <h4 className="font-semibold text-sm">{talent.name}</h4>
                        <p className="text-xs text-[#666666]">{talent.title}</p>
                      </div>
                      <button className="ml-2 bg-white border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] px-2 py-1 rounded-full text-xs font-semibold">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "training" && step.resources?.trainings && (
                <div className="pl-2">
                  {step.resources.trainings.map((training) => (
                    <div key={training.id} className="p-2 mb-2 border-b border-dashed border-[#e0e0e0]">
                      <h4 className="font-semibold text-sm">{training.title}</h4>
                      <p className="text-xs text-[#666666]">{training.provider} • {training.duration}</p>
                      <button className="mt-1 bg-[#0a66c2] hover:bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        <FaPlayCircle className="mr-1 inline" /> Start Course
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "services" && step.resources?.services && (
                <div className="pl-2">
                  {step.resources.services.map((service) => (
                    <div key={service.id} className="p-2 mb-2 border-b border-dashed border-[#e0e0e0]">
                      <h4 className="font-semibold text-sm">{service.name}</h4>
                      <p className="text-xs text-[#666666]">{service.description}</p>
                      <button className="mt-1 bg-[#0a66c2] hover:bg-blue-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        <FaExternalLinkAlt className="mr-1 inline" /> Learn More
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* ConsultIn tab content */}
              {activeTab === "consultin" && step.consultInAction && (
                <div className="pl-2">
                  {/* AgentMarketplace Dialog */}
                  <AgentMarketplace 
                    isOpen={showConsultInDialog}
                    onClose={() => setShowConsultInDialog(false)}
                    onInstallAgent={handleInstallAgent}
                  />
                  
                  {!showConsultInAction ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="text-center mb-3">
                        <FaRobot className="inline-block text-4xl text-[#0a66c2] mb-2" />
                        <h4 className="font-semibold">ConsultIn - Your Digital Consultant</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Let ConsultIn help you implement this step by drafting emails, creating forms, or recommending products
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Button 
                          onClick={handleConsultInClick}
                          disabled={isConsultInThinking}
                          className="bg-[#0a66c2] hover:bg-blue-700 text-white rounded-full text-sm font-semibold"
                        >
                          {isConsultInThinking ? (
                            <>
                              <FaSpinner className="mr-2 inline-block animate-spin" /> 
                              ConsultIn is thinking...
                            </>
                          ) : (
                            <>
                              <FaRobot className="mr-2 inline-block" /> 
                              Generate ConsultIn Action
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          onClick={() => setShowConsultInDialog(true)}
                          variant="outline"
                          className="border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] rounded-full text-sm font-semibold"
                        >
                          <FaTools className="mr-2 inline-block" /> 
                          Browse Agent Marketplace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded p-3 bg-blue-50 mb-3">
                      {/* Email action type */}
                      {step.consultInAction.type === 'email' && (
                        <div>
                          <div className="flex items-center mb-2">
                            <FaEnvelope className="text-[#0a66c2] mr-2" size={16} />
                            <h4 className="font-semibold">Email Draft</h4>
                          </div>
                          
                          <div className="bg-white p-3 border rounded mb-2">
                            <div className="mb-2">
                              <label className="block text-xs font-semibold mb-1">To:</label>
                              <Input 
                                value={step.consultInAction.recipient}
                                className="text-sm"
                                readOnly
                              />
                            </div>
                            
                            {step.consultInAction.ccList && step.consultInAction.ccList.length > 0 && (
                              <div className="mb-2">
                                <label className="block text-xs font-semibold mb-1">CC:</label>
                                <Input 
                                  value={step.consultInAction.ccList.join("; ")}
                                  className="text-sm"
                                  readOnly
                                />
                              </div>
                            )}
                            
                            <div className="mb-2">
                              <label className="block text-xs font-semibold mb-1">Subject:</label>
                              <Input 
                                value={step.consultInAction.subject}
                                className="text-sm"
                                readOnly
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-semibold mb-1">Message:</label>
                              <Textarea 
                                value={step.consultInAction.body}
                                className="text-sm h-40 whitespace-pre-line"
                                readOnly
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">
                              <FaClipboard className="mr-1" /> Copy
                            </Button>
                            <Button size="sm">
                              <FaPaperPlane className="mr-1" /> Send via Email Client
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Form action type */}
                      {step.consultInAction.type === 'form' && (
                        <div>
                          <div className="flex items-center mb-2">
                            <FaClipboard className="text-[#0a66c2] mr-2" size={16} />
                            <h4 className="font-semibold">{step.consultInAction.formTitle}</h4>
                          </div>
                          
                          <div className="bg-white p-3 border rounded mb-2">
                            {step.consultInAction.formFields.map((field, idx) => (
                              <div key={idx} className="mb-3">
                                {field.type === 'text' && (
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <Input 
                                      defaultValue={field.value || ''}
                                      className="text-sm"
                                      placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                  </div>
                                )}
                                
                                {field.type === 'date' && (
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <Input 
                                      type="date"
                                      className="text-sm"
                                    />
                                  </div>
                                )}
                                
                                {field.type === 'number' && (
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <Input 
                                      type="number"
                                      className="text-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                )}
                                
                                {field.type === 'select' && field.options && (
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <Select>
                                      <SelectTrigger className="text-sm">
                                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options.map((option, optIdx) => (
                                          <SelectItem key={optIdx} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                
                                {field.type === 'checkbox' && (
                                  <div className="flex items-center mt-2">
                                    <Checkbox id={`checkbox-${idx}`} />
                                    <label 
                                      htmlFor={`checkbox-${idx}`} 
                                      className="ml-2 text-xs"
                                    >
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button variant="outline" size="sm" className="mr-2">
                              Reset
                            </Button>
                            <Button size="sm">
                              Submit Form
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Product action type */}
                      {step.consultInAction.type === 'product' && (
                        <div>
                          <div className="flex items-center mb-3">
                            <FaCreditCard className="text-[#0a66c2] mr-2" size={16} />
                            <h4 className="font-semibold">Recommended Products & Services</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {step.consultInAction.products.map((product) => (
                              <div key={product.id} className="bg-white border rounded p-3 flex">
                                {product.imageUrl && (
                                  <div className="h-16 w-16 flex-shrink-0">
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name}
                                      className="h-full w-full object-cover rounded"
                                    />
                                  </div>
                                )}
                                <div className={product.imageUrl ? "ml-3 flex-1" : "flex-1"}>
                                  <h5 className="font-semibold text-sm">{product.name}</h5>
                                  <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                                  <div className="flex items-center justify-between">
                                    {product.price && (
                                      <span className="font-bold text-sm text-[#0a66c2]">{product.price}</span>
                                    )}
                                    <Button size="sm" variant="outline" className="text-xs">
                                      Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SolutionsContainer = ({ solution }: SolutionsContainerProps) => {
  const [activeTab, setActiveTab] = useState("process");
  
  const tabs = [
    { id: "process", name: "Step-by-Step Process", icon: FaClipboardList },
    { id: "experts", name: "Connect with Experts", icon: FaUserTie },
    { id: "conversations", name: "Conversations", icon: FaComments },
    { id: "talent", name: "Talent", icon: FaUsers },
    { id: "training", name: "Training", icon: FaGraduationCap },
    { id: "services", name: "Services", icon: FaTools },
  ];

  return (
    <Card className="mb-6 linkedin-card">
      <div className="p-4 border-b border-[#e0e0e0]">
        <h2 className="text-lg font-semibold">Personalized Solutions</h2>
        <p className="text-sm text-[#666666] mt-1">Based on your business challenges</p>
      </div>
      
      <div className="p-4">
        <div className="bg-[#e8f3ff] border-l-4 border-[#0a66c2] rounded p-4 mb-6">
          <p className="text-sm">
            <span className="font-semibold">AI Analysis:</span> {solution.analysis}
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-[#e0e0e0] mb-4 overflow-x-auto">
          <ul className="flex -mb-px whitespace-nowrap">
            {tabs.map((tab) => (
              <li key={tab.id} className="mr-1">
                <button 
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <tab.icon className="mr-1 inline" /> {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Process Steps Tab */}
        {activeTab === "process" && solution.processSteps && (
          <div id="process">
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Follow this step-by-step process:</h3>
              <p className="text-sm text-[#666666]">Each step includes specific actions and resources to help you solve your business problem</p>
            </div>
            
            {solution.processSteps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>
        )}
        
        {/* Experts Content Tab */}
        {activeTab === "experts" && (
          <div id="experts" className="mb-6">
            <h3 className="font-semibold mb-3">Supply Chain Experts to Connect With</h3>
            
            {solution.experts.map((expert) => (
              <div key={expert.id} className="flex items-center p-3 border border-[#e0e0e0] rounded-lg mb-3 hover:shadow-sm">
                <img 
                  src={expert.profileImage || ''} 
                  alt={expert.name} 
                  className="h-12 w-12 rounded-full object-cover" 
                />
                <div className="ml-3 flex-1">
                  <h4 className="font-semibold">{expert.name}</h4>
                  <p className="text-sm text-[#666666]">{expert.title} at {expert.company}</p>
                  <p className="text-xs text-[#666666]">{expert.connections}+ connections • {expert.experience}</p>
                </div>
                <button className="ml-2 bg-white border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] px-3 py-1 rounded-full text-sm font-semibold">
                  <FaUserPlus className="mr-1 inline" /> Connect
                </button>
              </div>
            ))}
            
            <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
              Show more experts <FaChevronDown className="ml-1" />
            </a>
          </div>
        )}
        
        {/* Conversations Tab */}
        {activeTab === "conversations" && (
          <div id="conversations">
            <h3 className="font-semibold mb-3">Related Discussions in Your Industry</h3>
            
            {solution.conversations.map((conversation) => (
              <div key={conversation.id} className="p-3 border border-[#e0e0e0] rounded-lg mb-3 hover:shadow-sm">
                <div className="flex items-center mb-2">
                  <img 
                    src={conversation.authorImage || ''} 
                    alt={conversation.authorName} 
                    className="h-8 w-8 rounded-full object-cover" 
                  />
                  <div className="ml-2">
                    <h4 className="font-semibold text-sm">{conversation.authorName}</h4>
                    <p className="text-xs text-[#666666]">{conversation.authorTitle} • {conversation.postedTime}</p>
                  </div>
                </div>
                <p className="text-sm mb-2">{conversation.content}</p>
                <div className="flex items-center text-xs text-[#666666]">
                  <span><FaThumbsUp className="mr-1 inline" /> {conversation.likes}</span>
                  <span className="ml-3"><FaComment className="mr-1 inline" /> {conversation.comments} comments</span>
                </div>
              </div>
            ))}
            
            <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
              Browse more conversations <FaChevronDown className="ml-1" />
            </a>
          </div>
        )}
        
        {/* Talent Tab */}
        {activeTab === "talent" && (
          <div id="talent">
            <h3 className="font-semibold mb-3">Supply Chain Professionals You Can Hire</h3>
            
            {solution.talents.map((talent) => (
              <div key={talent.id} className="flex items-center p-3 border border-[#e0e0e0] rounded-lg mb-3 hover:shadow-sm">
                <img 
                  src={talent.profileImage || ''} 
                  alt={talent.name} 
                  className="h-12 w-12 rounded-full object-cover" 
                />
                <div className="ml-3 flex-1">
                  <h4 className="font-semibold">{talent.name}</h4>
                  <p className="text-sm text-[#666666]">{talent.title}</p>
                  <p className="text-xs text-[#666666]"><FaMapMarkerAlt className="mr-1 inline" /> {talent.location} • {talent.availability}</p>
                </div>
                <button className="ml-2 bg-white border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] px-3 py-1 rounded-full text-sm font-semibold">
                  <FaPaperPlane className="mr-1 inline" /> Message
                </button>
              </div>
            ))}
            
            <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
              Post a job opening <FaArrowRight className="ml-1" />
            </a>
          </div>
        )}
        
        {/* Training Tab */}
        {activeTab === "training" && (
          <div id="training">
            <h3 className="font-semibold mb-3">Recommended Courses & Training</h3>
            
            {solution.trainings.map((training) => (
              <div key={training.id} className="p-3 border border-[#e0e0e0] rounded-lg mb-3 hover:shadow-sm">
                <div className="flex">
                  <div className="h-16 w-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={training.thumbnail || ''} 
                      alt="Course thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold">{training.title}</h4>
                    <p className="text-sm text-[#666666]">{training.provider} • {training.duration}</p>
                    <p className="text-xs text-[#666666] mt-1">{training.description}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#e0e0e0] flex justify-between items-center">
                  <span className="text-sm text-[#666666]">{training.rating} ⭐ ({training.reviewCount} reviews)</span>
                  <button className="bg-[#0a66c2] hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <FaPlayCircle className="mr-1 inline" /> Start Course
                  </button>
                </div>
              </div>
            ))}
            
            <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
              Explore all courses <FaChevronDown className="ml-1" />
            </a>
          </div>
        )}
        
        {/* Services Tab */}
        {activeTab === "services" && (
          <div id="services">
            <h3 className="font-semibold mb-3">Recommended Tools & Services</h3>
            
            {solution.services.map((service) => (
              <div key={service.id} className="p-3 border border-[#e0e0e0] rounded-lg mb-3 hover:shadow-sm">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-white border border-[#e0e0e0] rounded p-1 flex items-center justify-center">
                    <FaTools className="text-[#0a66c2] text-2xl" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-[#666666]">{service.description}</p>
                    <p className="text-xs text-[#666666] mt-1">{service.usageStats}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#e0e0e0] flex justify-between items-center">
                  <span className="text-sm text-[#666666]">{service.pricing}</span>
                  <button className="bg-[#0a66c2] hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <FaExternalLinkAlt className="mr-1 inline" /> Learn More
                  </button>
                </div>
              </div>
            ))}
            
            <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
              View all recommended services <FaChevronDown className="ml-1" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SolutionsContainer;