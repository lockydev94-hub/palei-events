import { NotFoundState } from "@/components/ui/NotFoundState";
import { APP_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] pt-24">
      <NotFoundState
        title={`This page is no longer available.`}
        description="It may have moved or the link may be out of date. Let's take you back to the start."
        ctaLabel={`Explore ${APP_NAME}`}
        ctaHref="/"
      />
    </div>
  );
}