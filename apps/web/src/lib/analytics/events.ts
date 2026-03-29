/**
 * PostHog event names (snake_case). Keep in sync with dashboard taxonomy.
 *
 * Dashboard (project 361562): https://us.posthog.com/project/361562/dashboard/1410517
 */
export const AnalyticsEvents = {
  // Navigation & marketing
  pageview_manual: "$pageview",
  app_nav_clicked: "app_nav_clicked",
  marketing_cta_clicked: "marketing_cta_clicked",
  marketing_nav_link_clicked: "marketing_nav_link_clicked",

  // Auth
  google_sign_in_clicked: "google_sign_in_clicked",
  oauth_sign_in_success_server: "oauth_sign_in_success_server",

  // Onboarding
  onboarding_completed: "onboarding_completed",

  // Courses & content
  course_card_clicked: "course_card_clicked",
  lesson_viewed: "lesson_viewed",
  lesson_marked_complete: "lesson_marked_complete",
  course_quiz_started: "course_quiz_started",
  course_quiz_completed: "course_quiz_completed",

  // Commerce
  payment_proof_submitted_client: "payment_proof_submitted_client",
  payment_proof_received_server: "payment_proof_received_server",
  continue_learning_clicked: "continue_learning_clicked",

  // Explore
  explore_olympiad_filter_changed: "explore_olympiad_filter_changed",
  explore_search_submitted: "explore_search_submitted",

  // Research quizzes
  research_quiz_hub_paper_clicked: "research_quiz_hub_paper_clicked",
  research_quiz_session_started: "research_quiz_session_started",
  research_quiz_question_answered: "research_quiz_question_answered",
  research_quiz_completed: "research_quiz_completed",

  // YSC
  ysc_name_search_submitted: "ysc_name_search_submitted",
  ysc_certificate_download_clicked: "ysc_certificate_download_clicked",
  ysc_certificate_generated_server: "ysc_certificate_generated_server",

  // Media
  hero_video_play: "hero_video_play",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
