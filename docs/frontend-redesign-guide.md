# Frontend Redesign Guide

**Status**: Planned
**Phase**: 4.1-4.11

## Overview

This document outlines the frontend redesign strategy for TwentyCRM with modern UI/UX improvements.

## Phase 4.1: Design Requirements

### Goals
- Modern, clean aesthetic
- Improved accessibility (WCAG 2.1 AA)
- Better mobile responsive design
- Enhanced user experience

### Design System Approach
- Extend existing `twenty-ui` package
- Maintain backward compatibility
- Incremental rollout

## Phase 4.2: UI Component Library Updates

### Theme Updates (packages/twenty-ui/src/theme/)
```typescript
// Updated color palette
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... enhanced blue scale
  },
  secondary: {
    // New secondary color system
  },
  // Enhanced semantic colors
}

// Typography improvements
typography: {
  fontFamily: 'Inter, system-ui, sans-serif',
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

// Spacing system
spacing: (factor) => `${factor * 0.25}rem`,

// Border radius
borderRadius: {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}
```

### Component Enhancements

#### Button Component
- New variants: outline, ghost, link
- Size options: xs, sm, md, lg, xl
- Loading states with spinners
- Icon support (left/right)

#### Input Component
- Enhanced focus states
- Better error display
- Helper text support
- Character count
- Clear button

#### Card Component
- Subtle shadows
- Hover states
- Bordered variant
- Header/footer sections

## Phase 4.3: Layout & Navigation Redesign

### Main Navigation
**Location**: `packages/twenty-front/src/modules/ui/layout/navigation/`

Improvements:
- Collapsible sidebar
- Quick actions menu
- Search spotlight (Cmd+K)
- Notification center
- User profile dropdown

### Responsive Layout
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Off-canvas navigation for mobile
- Adaptive grid system

## Phase 4.4: Dashboard & Home Page Redesign

### Dashboard Components
**Location**: `packages/twenty-front/src/pages/`

New Features:
- Customizable widget system
- Drag-and-drop layout
- Real-time metrics with charts
- Activity feed with filters
- Quick actions panel

### Widgets
- Sales pipeline overview
- Recent activities
- Top opportunities
- Team performance
- Tasks & reminders
- Whop membership stats (new)
- AI insights panel (new)

## Phase 4.5: Object Record Pages Redesign

### List View Improvements
- Enhanced table with virtual scrolling
- Advanced filtering UI
- Bulk actions toolbar
- Column customization
- Saved views

### Detail View Improvements
- Tabbed interface (Overview, Activity, Related)
- Inline editing
- Activity timeline
- Related records sidebar
- Quick actions menu

## Phase 4.6: Settings Pages Redesign

### Settings Navigation
- Sidebar navigation
- Search functionality
- Quick links

### Integration Pages
- Card-based layout for integrations
- Connection status badges
- One-click setup flows
- Usage statistics

## Phase 4.7: Forms & Modals Redesign

### Form Improvements
- Multi-step forms with progress
- Field validation with inline errors
- Auto-save drafts
- Keyboard shortcuts

### Modal System
- Slide-over panels for quick actions
- Full-screen modals for complex forms
- Toast notifications system
- Confirmation dialogs

## Phase 4.8: Animations & Micro-interactions

### Animation Library
```typescript
// Transition presets
transitions: {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
}

// Common animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Loading States
- Skeleton screens
- Progress indicators
- Optimistic UI updates
- Smooth transitions

## Phase 4.9: Accessibility & Performance

### Accessibility Checklist
- [ ] Keyboard navigation for all interactive elements
- [ ] ARIA labels on all form controls
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet WCAG AA
- [ ] Screen reader tested
- [ ] Skip navigation links
- [ ] Semantic HTML

### Performance Optimizations
- Code splitting by route
- Lazy loading images
- Virtual scrolling for long lists
- Memoization of expensive components
- Bundle size monitoring

## Phase 4.10: Testing Strategy

### Visual Regression Testing
```bash
# Storybook visual tests
npx nx storybook:build twenty-front
npx nx storybook:serve-and-test:static twenty-front
```

### Cross-Browser Testing
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest)

### Responsive Testing
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

## Phase 4.11: Documentation

### Component Documentation
- Update Storybook stories for all components
- Add usage examples
- Document props and variants
- Include accessibility notes

### Migration Guide
- Breaking changes (if any)
- Component mapping (old → new)
- Step-by-step upgrade path

## Implementation Priority

### High Priority (Must Have)
1. Theme system updates
2. Button and input components
3. Navigation improvements
4. List view enhancements

### Medium Priority (Should Have)
1. Dashboard widgets
2. Modal system
3. Form improvements
4. Animations

### Low Priority (Nice to Have)
1. Advanced customization
2. Experimental features
3. Additional micro-interactions

## Timeline Estimate

- Phase 4.1-4.2: 2 weeks (Design system)
- Phase 4.3-4.5: 3 weeks (Core pages)
- Phase 4.6-4.7: 2 weeks (Settings & forms)
- Phase 4.8-4.9: 2 weeks (Polish & accessibility)
- Phase 4.10-4.11: 1 week (Testing & docs)

**Total**: ~10 weeks

## Resources

- Figma designs: [Link to designs]
- Storybook: http://localhost:6006
- Accessibility guide: https://www.w3.org/WAI/WCAG21/quickref/

---

**Status**: Ready for implementation
**Next Steps**: Create Figma designs and get stakeholder approval
