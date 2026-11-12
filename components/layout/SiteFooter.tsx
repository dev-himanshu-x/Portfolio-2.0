import Image from "next/image";
import { LINKS, SITE } from "@/content/site";
import { FooterGrass } from "./FooterGrass";

/** Contact footer — calm centred call-to-action over a paper-cut meadow. */
export function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <p className="hud-eyebrow">PLATE 04 — CORRESPONDENCE</p>
      <p className="footer__cta">GET IN TOUCH</p>
      <div className="footer__links">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <p className="footer__fine">MADE WITH ❤️ BY {SITE.name.toUpperCase()}</p>
      <Image
        className="footer__lizard"
        src="/images/footer-lizard.png"
        alt=""
        width={905}
        height={955}
        aria-hidden="true"
      />
      <FooterGrass />
    </footer>
  );
}
