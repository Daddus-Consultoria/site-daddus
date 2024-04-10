export interface NavigationItem {
  title: string;
  href?: string;
}

export interface NavigationSubType extends NavigationItem {
  items?: NavigationItem[];
}

export interface NavigationType extends NavigationItem {
  subtypes?: NavigationSubType[];
}

export interface BreadcrumbItemProps {
  title: string;
  href?: string;
}
