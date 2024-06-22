"use client";

import { ArrowLeftIcon, BellRing, BlocksIcon, Code2Icon, LinkIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@formbricks/lib/cn";
import { TSurvey } from "@formbricks/types/surveys";
import { TUser } from "@formbricks/types/user";
import { Button } from "@formbricks/ui/Button";
import { Dialog, DialogContent } from "@formbricks/ui/Dialog";
import { ShareSurveyLink } from "@formbricks/ui/ShareSurveyLink";
import { EmailTab } from "./shareEmbedTabs/EmailTab";
import { LinkTab } from "./shareEmbedTabs/LinkTab";
import { WebpageTab } from "./shareEmbedTabs/WebpageTab";

interface ShareEmbedSurveyProps {
  survey: TSurvey;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  webAppUrl: string;
  user: TUser;
}
export const ShareEmbedSurvey = ({ survey, open, setOpen, webAppUrl, user }: ShareEmbedSurveyProps) => {
  const router = useRouter();
  const environmentId = survey.environmentId;
  const isSingleUseLinkSurvey = survey.singleUse?.enabled ?? false;
  const { email } = user;

  const tabs = [
    { id: "email", label: "Embed in an Email", icon: MailIcon },
    { id: "webpage", label: "Embed in a Web Page", icon: Code2Icon },
    { id: "link", label: `${isSingleUseLinkSurvey ? "Single Use Links" : "Share the Link"}`, icon: LinkIcon },
  ];

  const [activeId, setActiveId] = useState(tabs[0].id);
  const [showInitialPage, setShowInitialPage] = useState(true);
  const [surveyUrl, setSurveyUrl] = useState("");

  const handleOpenChange = (open: boolean) => {
    setActiveId(tabs[0].id);
    setOpen(open);
    setShowInitialPage(open); // Reset to initial page when modal opens

    // fetch latest responses
    router.refresh();
  };

  const handleInitialPageButton = () => {
    setShowInitialPage(!showInitialPage);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-xl bg-white p-0 md:max-w-3xl lg:h-[700px] lg:max-w-5xl">
        {showInitialPage ? (
          <div className="h-full max-w-full overflow-hidden">
            <div className="flex h-[200px] w-full flex-col items-center justify-center space-y-6 p-8 text-center lg:h-2/5">
              <p className="pt-2 text-xl font-semibold text-slate-800">Your survey is public 🎉</p>
              <ShareSurveyLink
                survey={survey}
                webAppUrl={webAppUrl}
                surveyUrl={surveyUrl}
                setSurveyUrl={setSurveyUrl}
              />
            </div>
            <div className="flex h-[300px] flex-col items-center justify-center gap-8 rounded-b-lg bg-slate-50 px-8 lg:h-3/5">
              <p className="-mt-8 text-sm text-slate-500">What&apos;s next?</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleInitialPageButton}
                  className="flex flex-col items-center gap-3 rounded-lg border border-slate-100 bg-white p-4 text-sm  text-slate-500 hover:border-slate-200 md:p-8">
                  <Code2Icon className="h-6 w-6 text-slate-700" />
                  Embed survey
                </button>
                <Link
                  href={`/environments/${environmentId}//settings/notifications`}
                  className="flex flex-col items-center gap-3 rounded-lg border border-slate-100  bg-white p-4  text-sm text-slate-500 hover:border-slate-200 md:p-8">
                  <BellRing className="h-6 w-6 text-slate-700" />
                  Configure alerts
                </Link>
                <Link
                  href={`/environments/${environmentId}/integrations`}
                  className="flex flex-col items-center gap-3 rounded-lg border border-slate-100  bg-white  p-4 text-sm text-slate-500 hover:border-slate-200 md:p-8">
                  <BlocksIcon className="h-6 w-6 text-slate-700" />
                  Setup integrations
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            <div className="border-b border-slate-200 py-2">
              <Button
                variant="minimal"
                className="focus:ring-0"
                onClick={handleInitialPageButton}
                StartIcon={ArrowLeftIcon}>
                Back
              </Button>
            </div>
            <div className="grid h-full grid-cols-4">
              <div className="col-span-1 hidden flex-col gap-3 border-r border-slate-200 p-4 lg:flex">
                {tabs.map((tab) => (
                  <Button
                    StartIcon={tab.icon}
                    startIconClassName="h-4 w-4"
                    variant="minimal"
                    key={tab.id}
                    onClick={() => setActiveId(tab.id)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-slate-600",
                      // "focus:ring-0 focus:ring-offset-0", // enable these classes to remove the focus rings on buttons
                      tab.id === activeId
                        ? "border-slate-200 bg-slate-100 font-semibold text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                    aria-current={tab.id === activeId ? "page" : undefined}>
                    {tab.label}
                  </Button>
                ))}
              </div>
              <div className="col-span-4 h-full overflow-y-auto bg-slate-50 px-4 py-6 lg:col-span-3 lg:p-6">
                <div>
                  {activeId === "email" ? (
                    <EmailTab surveyId={survey.id} email={email} />
                  ) : activeId === "webpage" ? (
                    <WebpageTab surveyUrl={surveyUrl} />
                  ) : activeId === "link" ? (
                    <LinkTab
                      survey={survey}
                      webAppUrl={webAppUrl}
                      surveyUrl={surveyUrl}
                      setSurveyUrl={setSurveyUrl}
                    />
                  ) : null}
                </div>
                <div className="mt-2 rounded-md p-3 text-center lg:hidden">
                  {tabs.slice(0, 2).map((tab) => (
                    <Button
                      variant="minimal"
                      key={tab.id}
                      onClick={() => setActiveId(tab.id)}
                      className={cn(
                        "rounded-md px-4 py-2",
                        tab.id === activeId
                          ? "bg-white text-slate-900 shadow-sm"
                          : "border-transparent text-slate-700 hover:text-slate-900"
                      )}>
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
