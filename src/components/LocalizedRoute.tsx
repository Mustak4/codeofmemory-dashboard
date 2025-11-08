import { Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import { languages } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/config";

interface LocalizedRouteProps {
  path: string;
  element: ReactElement;
}

export const LocalizedRoute = ({ path, element }: LocalizedRouteProps) => {
  return (
    <>
      {/* English route (no prefix) */}
      <Route path={path} element={element} />
      {/* Localized routes */}
      {languages.filter(lang => lang.code !== "en").map((lang) => (
        <Route
          key={lang.code}
          path={`/${lang.code}${path}`}
          element={element}
        />
      ))}
    </>
  );
};

export const createLocalizedRoutes = (routes: Array<{ path: string; element: ReactElement }>) => {
  return routes.flatMap((route) => {
    const localizedRoutes = [
      <Route key={route.path} path={route.path} element={route.element} />,
    ];
    
    languages.filter(lang => lang.code !== "en").forEach((lang) => {
      localizedRoutes.push(
        <Route
          key={`${lang.code}${route.path}`}
          path={`/${lang.code}${route.path}`}
          element={route.element}
        />
      );
    });
    
    return localizedRoutes;
  });
};

