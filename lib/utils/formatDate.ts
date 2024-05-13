import { Locale, format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IPublishRelativeNowProps {
  prefix?: boolean;
}

export function FormatDate(date: Date | string, locale?: Locale) {
  const publishedDateFormatted = format(date, "MM/dd/yyyy HH'h'mm", {
    locale: locale || ptBR,
  });

  const ISODate = date.toString();

  const publishedDateRelativeToNow = ({ prefix }: IPublishRelativeNowProps) =>
    formatDistanceToNow(date, {
      locale: locale || ptBR,
      addSuffix: prefix || true,
    });

  return { publishedDateFormatted, ISODate, publishedDateRelativeToNow };
}
