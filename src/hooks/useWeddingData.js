// src/hooks/useWeddingData.js
import { useState, useEffect, useCallback } from 'react';
import { getProjectBySlugOrDomain, getProjectContent } from '../lib/supabase';

// Default content for components (fallback if not in Supabase)
const defaultContent = {
  hero: {
    background_image: '',
    background_video: '',
    tagline: 'Wir heiraten',
    location_short: '',
  },
  countdown: {
    target_date: '',
    title: 'Noch',
    show_seconds: false,
  },
  lovestory: {
    title: 'Unsere Geschichte',
    subtitle: '',
    events: [],
  },
  timeline: {
    title: 'Tagesablauf',
    events: [],
  },
  locations: {
    title: 'Locations',
    locations: [],
  },
  directions: {
    title: 'Anfahrt',
    address: '',
    description: '',
    options: [],
  },
  rsvp: {
    title: 'Zusage',
    description: '',
    deadline: '',
  },
  dresscode: {
    title: 'Dresscode',
    code: '',
    description: '',
    colors: [],
    dos: [],
    donts: [],
  },
  gifts: {
    title: 'Geschenke',
    description: '',
    items: [],
  },
  accommodations: {
    title: 'Übernachtung',
    description: '',
    hotels: [],
  },
  witnesses: {
    title: 'Trauzeugen',
    persons: [],
  },
  gallery: {
    title: 'Galerie',
    images: [],
  },
  guestbook: {
    title: 'Gästebuch',
    description: '',
  },
  musicwishes: {
    title: 'Musikwünsche',
    description: '',
  },
  photoupload: {
    title: 'Eure Fotos',
    description: '',
  },
  faq: {
    title: 'FAQ',
    questions: [],
  },
  weddingabc: {
    title: 'Hochzeits-ABC',
    entries: [],
  },
  contact: {
    title: 'Kontakt',
  },
  footer: {
    names: '',
    tagline: '',
    hashtag: '',
  },
  savethedate: {
    tagline: 'Save the Date',
    message: '',
  },
  archive: {
    thank_you_title: 'Danke!',
    thank_you_text: '',
  },
};

export function useWeddingData(slugOrDomain) {
  const [project, setProject] = useState(null);
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch function that can be called to reload data
  const fetchData = useCallback(async () => {
    if (!slugOrDomain) {
      setIsLoading(false);
      setError('No slug or domain provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch project
      const { data: projectData, error: projectError } = await getProjectBySlugOrDomain(slugOrDomain);
      
      if (projectError || !projectData) {
        setError('Project not found');
        setIsLoading(false);
        return;
      }

      setProject(projectData);

      // Fetch content
      const { data: contentData, error: contentError } = await getProjectContent(projectData.id);
      
      if (contentError) {
        console.warn('Error fetching content:', contentError);
      }

      // Merge with defaults
      const mergedContent = { ...defaultContent };
      if (contentData) {
        Object.keys(contentData).forEach(component => {
          mergedContent[component] = {
            ...defaultContent[component],
            ...contentData[component],
          };
        });
      }

      setContent(mergedContent);
    } catch (err) {
      console.error('Error fetching wedding data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [slugOrDomain]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch function to reload data after admin changes
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Helper to get content for a specific component
  const getContent = useCallback((componentName) => {
    return content[componentName] || defaultContent[componentName] || {};
  }, [content]);

  // Check if a component is active
  const isComponentActive = useCallback((componentName) => {
    if (!project) return false;
    // If no active_components defined, show all
    if (!project.active_components || project.active_components.length === 0) return true;
    // Check for 'all' or specific component
    return project.active_components.includes('all') ||
           project.active_components.includes(componentName);
  }, [project]);

  // Check if a component should appear in navigation
  // Returns true if: nav_components is empty (show all active) OR component is in nav_components
  const isInNavigation = useCallback((componentName) => {
    if (!project) return false;
    // If no nav_components defined or empty, fall back to isComponentActive
    if (!project.nav_components || project.nav_components.length === 0) {
      return isComponentActive(componentName);
    }
    // Check if component is in nav_components list
    return project.nav_components.includes(componentName);
  }, [project, isComponentActive]);

  // Get ordered list of navigation components
  const getNavComponents = useCallback(() => {
    if (!project) return [];
    const componentOrder = project.component_order || [];
    const navComponents = project.nav_components || [];
    const activeComponents = project.active_components || [];

    // If nav_components is set, use it (already ordered by component_order in admin)
    if (navComponents.length > 0) {
      // Return nav_components in the order they appear in component_order
      return componentOrder.filter(comp => navComponents.includes(comp));
    }

    // Fallback: return all active components in component_order
    return componentOrder.filter(comp =>
      activeComponents.includes(comp) || activeComponents.includes('all')
    );
  }, [project]);

  // Get custom styles
  const getCustomStyles = useCallback(() => {
    return project?.custom_styles || {};
  }, [project]);

  return {
    project,
    content,
    isLoading,
    error,
    getContent,
    isComponentActive,
    isInNavigation,
    getNavComponents,
    getCustomStyles,
    refetch, // NEW: Allows reloading data
    // Convenience properties
    status: project?.status || 'live',
    theme: project?.theme || 'botanical',
    coupleNames: project?.couple_names || 'Name & Name',
    weddingDate: project?.wedding_date || '',
    slug: project?.slug || '',
    projectId: project?.id || null,
  };
}

export default useWeddingData;
