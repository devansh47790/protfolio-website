import { Link } from 'react-router-dom';
import { siteSettings } from '../../data/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-surface-400 bg-surface-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-3 md:py-24">
        <div>
          <h3 className="text-h3">{siteSettings.ownerName}</h3>
          <p className="mt-4 max-w-xs text-body-md text-charcoal-500">{siteSettings.tagline}</p>
        </div>

        <div>
          <h4 className="caption text-gold-500">Pages</h4>
          <ul className="mt-6 space-y-3 text-body-md">
            <li><Link to="/about" className="text-charcoal-700 hover:text-gold-500">About</Link></li>
            <li><Link to="/services" className="text-charcoal-700 hover:text-gold-500">Services</Link></li>
            <li><Link to="/projects" className="text-charcoal-700 hover:text-gold-500">Projects</Link></li>
            <li><Link to="/blog" className="text-charcoal-700 hover:text-gold-500">Journal</Link></li>
            <li><Link to="/contact" className="text-charcoal-700 hover:text-gold-500">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="caption text-gold-500">Elsewhere</h4>
          <ul className="mt-6 space-y-3 text-body-md">
            {siteSettings.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-charcoal-700 hover:text-gold-500"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteSettings.email}`} className="text-charcoal-700 hover:text-gold-500">
                {siteSettings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-400 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-charcoal-500 sm:flex-row">
          <p className="caption">Copyright {year} {siteSettings.ownerName}</p>
          <p className="caption">Wordpress / WooCommerce / React</p>
        </div>
      </div>
    </footer>
  );
}
