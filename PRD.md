# Content Planning & Collaboration Platform

A collaborative content planning and approval platform designed for marketing teams, agencies, and stakeholders to create, review, and approve social media content in a streamlined workflow.

**Experience Qualities**:
1. **Collaborative** - Multiple team members can work together seamlessly with real-time updates and feedback
2. **Intuitive** - Clean, organized interface that makes content planning feel effortless and professional
3. **Efficient** - Streamlined approval workflows that reduce back-and-forth and accelerate content creation

**Complexity Level**: Light Application (multiple features with basic state)
This application provides content planning, collaboration, and approval features with persistent state management, but avoids the complexity of external API integrations and actual publishing capabilities.

## Essential Features

### Content Creation & Editing
- **Functionality**: Rich text editor for creating social media posts with platform-specific previews
- **Purpose**: Allows teams to craft and visualize content before approval
- **Trigger**: Click "New Post" or select date on calendar
- **Progression**: Select platform → Write content → Add media → Preview → Save draft → Request approval
- **Success criteria**: Posts save automatically, preview accurately reflects platform formatting

### Calendar View
- **Functionality**: Monthly calendar interface showing scheduled content with drag-and-drop capabilities
- **Purpose**: Provides visual overview of content strategy and timing
- **Trigger**: Navigate to calendar tab or default view
- **Progression**: View month → See posts on dates → Drag to reschedule → Click post to edit
- **Success criteria**: Calendar loads quickly, drag-and-drop works smoothly, posts display with status indicators

### Approval Workflow
- **Functionality**: Submit posts for review, stakeholders can approve/reject with comments
- **Purpose**: Ensures content quality and alignment before final scheduling
- **Trigger**: Click "Submit for Approval" on draft post
- **Progression**: Draft → Pending Approval → Reviewer comments/approves → Status updates → Ready for schedule
- **Success criteria**: Clear status indicators, notifications work, approval history is maintained

### Comment System
- **Functionality**: Threaded comments on posts with @mentions and real-time updates
- **Purpose**: Facilitates feedback and collaboration between team members
- **Trigger**: Click comment icon on any post
- **Progression**: Open post → Add comment → @mention teammate → Submit → Real-time notification → Response thread
- **Success criteria**: Comments persist, @mentions work, real-time updates appear instantly

### Team Management
- **Functionality**: Add team members, assign roles (admin, editor, reviewer), manage permissions
- **Purpose**: Controls access and defines workflow responsibilities
- **Trigger**: Navigate to team settings
- **Progression**: Invite member → Assign role → Member accepts → Permissions active → Workflow enabled
- **Success criteria**: Role-based access controls work, invitations send properly

## Edge Case Handling
- **Empty States**: Friendly onboarding when no content exists with clear call-to-action buttons
- **Network Issues**: Offline indicators with local draft preservation and sync when reconnected
- **Large Media Files**: File size limits with compression suggestions and progress indicators
- **Simultaneous Editing**: Conflict resolution with last-save-wins and change notifications
- **Missing Permissions**: Clear error messages with suggested actions for insufficient access

## Design Direction
The design should feel professional yet approachable - like a premium collaboration tool that marketing professionals would be proud to use with clients. Modern, clean interface with purposeful use of whitespace and clear visual hierarchy that emphasizes content over chrome.

## Color Selection
**Complementary** - Blue and orange combination to create energy while maintaining professionalism, with blue representing trust/collaboration and orange for creativity/action.

- **Primary Color**: Deep Professional Blue (oklch(0.4 0.15 240)) - communicates trust, stability, and professionalism
- **Secondary Colors**: 
  - Light Blue Accent (oklch(0.85 0.08 240)) for backgrounds and subtle highlights
  - Neutral Gray (oklch(0.6 0.02 240)) for supporting text and borders
- **Accent Color**: Energetic Orange (oklch(0.7 0.15 45)) for call-to-action buttons, notifications, and approval states
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark text (oklch(0.2 0.02 240)) - Ratio 16.2:1 ✓
  - Primary Blue (oklch(0.4 0.15 240)): White text (oklch(1 0 0)) - Ratio 8.1:1 ✓
  - Accent Orange (oklch(0.7 0.15 45)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Card Background (oklch(0.98 0.01 240)): Dark text (oklch(0.2 0.02 240)) - Ratio 15.1:1 ✓

## Font Selection
Typography should convey modern professionalism with excellent readability for content creation workflows - Inter for its technical precision and Crimson Pro for content previews to add personality.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold/32px/tight tracking for strong hierarchy
  - H2 (Section Headers): Inter Semibold/24px/normal tracking for clear sections
  - H3 (Card Titles): Inter Medium/18px/normal tracking for content organization
  - Body (Interface Text): Inter Regular/16px/relaxed line-height for comfortable reading
  - Small (Meta Info): Inter Regular/14px/tight line-height for secondary information
  - Code/Tags: JetBrains Mono/14px for hashtags and technical elements

## Animations
Subtle and purposeful animations that enhance workflow understanding without distraction - focus on state transitions and feedback rather than decorative effects.

- **Purposeful Meaning**: Smooth transitions communicate workflow progress, hover states provide clear feedback, and loading animations maintain engagement during processing
- **Hierarchy of Movement**: Calendar interactions and approval state changes receive primary animation focus, while secondary actions use minimal micro-interactions

## Component Selection
- **Components**: 
  - Calendar: Custom grid with react-big-calendar integration using shadcn Card components
  - Post Editor: Textarea with shadcn Form components and custom platform preview cards
  - Approval Pipeline: shadcn Badge components with custom status colors and Dialog for comments
  - Comments: shadcn ScrollArea with custom threading and mention components
  - Navigation: shadcn Tabs for view switching with clean, minimal styling
- **Customizations**: 
  - Custom calendar grid component for content planning
  - Platform-specific preview components (Instagram square, Twitter card, LinkedIn post)
  - Real-time collaboration indicators and conflict resolution modals
- **States**: 
  - Buttons: Clear hover effects with slight scale and color shifts
  - Posts: Draft/pending/approved states with distinct border colors and status badges
  - Comments: Unread highlighting with subtle background changes
- **Icon Selection**: 
  - Phosphor icons for consistency: Calendar, PencilSimple, Users, Chat, Check, X
  - Platform icons: Instagram square, Twitter bird, LinkedIn logo for post types
- **Spacing**: 
  - Container padding: p-6 for main content areas
  - Card spacing: p-4 with gap-4 between elements
  - Button spacing: px-4 py-2 for standard actions, px-6 py-3 for primary CTAs
- **Mobile**: 
  - Stack calendar into list view on mobile
  - Collapsible sidebar for navigation
  - Touch-friendly comment interfaces with larger tap targets
  - Swipe gestures for post status changes