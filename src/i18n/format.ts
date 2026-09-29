/**
 * Tiny message helpers. Dictionaries hold plain, serializable data: "{name}"
 * placeholders and { one, other } plural forms chosen with Intl.PluralRules.
 */
import { INTL_LOCALE, type Locale } from "./config";

export type Plural = { one: string; other: string };
type Vars = Record<string, string | number>;

export function fmt(template: string, vars: Vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

const rules = new Map<Locale, Intl.PluralRules>();

/** The unfilled plural form for `count`. */
export function pluralForm(locale: Locale, forms: Plural, count: number) {
  let rule = rules.get(locale);
  if (!rule) rules.set(locale, (rule = new Intl.PluralRules(INTL_LOCALE[locale])));
  return rule.select(count) === "one" ? forms.one : forms.other;
}

/** Picks the plural form for `count` and fills it; `{count}` is always available. */
export function plural(locale: Locale, forms: Plural, count: number, vars: Vars = {}) {
  return fmt(pluralForm(locale, forms, count), { count, ...vars });
}

/** Splits a template around one placeholder, so a React node can take its place. */
export function around(template: string, key: string): [before: string, after: string] {
  const [before, after = ""] = template.split(`{${key}}`);
  return [before, after];
}
