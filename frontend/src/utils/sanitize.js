/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes script tags, event handlers, and other dangerous content
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary div element to parse HTML
  const temp = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!temp) {
    // Server-side: basic sanitization using regex
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }

  // Client-side: use DOM API for better sanitization
  temp.textContent = '';
  temp.innerHTML = html;

  // Remove script tags
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove event handlers from all elements
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove all event handler attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Remove javascript: protocol from href/src
      if ((attr.name === 'href' || attr.name === 'src') && attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Remove dangerous elements
  const dangerous = temp.querySelectorAll('iframe, object, embed, form, input, button');
  dangerous.forEach(el => el.remove());

  return temp.innerHTML;
}

/**
 * Converts newlines to <br> tags and sanitizes the result
 */
export function sanitizeTextWithLineBreaks(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // First sanitize, then replace newlines
  const sanitized = sanitizeHtml(text);
  return sanitized.replace(/\n/g, '<br>');
}




