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
      <div className="footer__lizard" aria-hidden="true">
        <Image
          className="footer__lizard-body"
          src="/images/footer-lizard-body.webp"
          alt=""
          width={720}
          height={760}
        />
        <Image
          className="footer__lizard-tongue"
          src="/images/footer-lizard-tongue.webp"
          alt=""
          width={720}
          height={760}
        />
      </div>
      <FooterGrass />
    </footer>
  );
}
