/**
 * Every dictionary of every language, for server code only (layouts, pages,
 * metadata, API routes). Client components get their language's UI texts
 * through <I18nProvider>, never by importing this file.
 */
import type { Locale } from "./config";
import { de as deLegal } from "./legal/de";
import { en as enLegal } from "./legal/en";
import { es as esLegal } from "./legal/es";
import { fr as frLegal } from "./legal/fr";
import { hu as huLegal } from "./legal/hu";
import type { LegalDocs } from "./legal/types";
import { de as deSite } from "./site/de";
import { en as enSite } from "./site/en";
import { es as esSite } from "./site/es";
import { fr as frSite } from "./site/fr";
import { hu as huSite, type SiteDict } from "./site/hu";
import { de as deUi } from "./ui/de";
import { en as enUi } from "./ui/en";
import { es as esUi } from "./ui/es";
import { fr as frUi } from "./ui/fr";
import { hu as huUi, type UiDict } from "./ui/hu";

export const UI: Record<Locale, UiDict> = { hu: huUi, en: enUi, de: deUi, fr: frUi, es: esUi };
export const SITE: Record<Locale, SiteDict> = { hu: huSite, en: enSite, de: deSite, fr: frSite, es: esSite };
export const LEGAL: Record<Locale, LegalDocs> = { hu: huLegal, en: enLegal, de: deLegal, fr: frLegal, es: esLegal };
