import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NotificationSettingsProps {
  notifyAnonymous: boolean;
  notifyPreview: boolean;
  onNotifyAnonymousChange: (value: boolean) => void;
  onNotifyPreviewChange: (value: boolean) => void;
}

export default function NotificationSettings({
  notifyAnonymous,
  notifyPreview,
  onNotifyAnonymousChange,
  onNotifyPreviewChange
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notification Settings</CardTitle>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>
          Configure how recipients are notified about your messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="anonymous-notifications" className="font-medium">Anonymous Notifications</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[220px] text-xs">Recipients will be notified but won't know who sent the message until delivery conditions are met.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">Notify recipients without revealing your identity</p>
            </div>
            <Switch 
              id="anonymous-notifications" 
              checked={notifyAnonymous}
              onCheckedChange={onNotifyAnonymousChange}
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="preview-notifications" className="font-medium">Preview Content</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[220px] text-xs">Recipients will see a preview of your message content in the notification.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">Include a preview of your message in notifications</p>
            </div>
            <Switch 
              id="preview-notifications" 
              checked={notifyPreview}
              onCheckedChange={onNotifyPreviewChange}
            />
          </div>
        </div>
        
        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Preview</p>
              <p className="text-muted-foreground mt-1">
                {notifyAnonymous ? (
                  <>You have a message waiting for you in <span className="text-blue-600 font-medium">Dearly</span>.</>
                ) : (
                  <>You have a message from <span className="text-blue-600 font-medium">John Smith</span> in Dearly.</>
                )}
                {notifyPreview && (
                  <span className="block mt-1 italic">"Hey there, I wanted to share some thoughts with you..."</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}