import { z } from "zod";

export * from "./sharedTypes";

export const ZIntegrationBase = z.object({
  id: z.string(),
  environmentId: z.string(),
});

export const ZIntegrationBaseSurveyData = z.object({
  createdAt: z.date(),
  questionIds: z.array(z.string()),
  includeHiddenFields: z.boolean().optional(),
  includeMetadata: z.boolean().optional(),
  questions: z.string(),
  surveyId: z.string(),
  surveyName: z.string(),
});
