/* ==========================================================================
   ALPNAAZ AESTHETIC STUDIO & SALON - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const siteHeader = document.getElementById('siteHeader');
  const heroVideo = document.getElementById('heroVideo');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.getElementById('soundText');

  // Navigation Drawer Elements
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerBookBtn = document.getElementById('drawerBookBtn');

  // Modal Elements
  const bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const headerScheduleBtn = document.getElementById('headerScheduleBtn');
  const heroScheduleBtn = document.getElementById('heroScheduleBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirmation = document.getElementById('bookingConfirmation');
  const confirmDoneBtn = document.getElementById('confirmDoneBtn');
  const bookServiceSelect = document.getElementById('bookService');
  const bookDateInput = document.getElementById('bookDate');
  const bookWhatsAppBtn = document.getElementById('bookWhatsAppBtn');

  // Set default date in booking picker (Tomorrow)
  if (bookDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookDateInput.value = tomorrow.toISOString().split('T')[0];
    bookDateInput.min = new Date().toISOString().split('T')[0];
  }

  // ==========================================
  // 1. STICKY HEADER ON SCROLL
  // ==========================================
  const handleScroll = () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================
  // 2. HERO VIDEO AUDIO TOGGLE
  // ==========================================
  if (heroVideo && soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
        if (soundText) soundText.textContent = 'AUDIO ON';
        soundToggle.style.color = '#d8b47f';
        soundToggle.style.borderColor = '#d8b47f';
      } else {
        heroVideo.muted = true;
        soundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
        if (soundText) soundText.textContent = 'AUDIO OFF';
        soundToggle.style.color = 'rgba(255, 255, 255, 0.8)';
        soundToggle.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }
    });

    // Make sure hero video plays even on aggressive power-saving browsers
    const playHero = () => {
      heroVideo.play().catch(err => {
        console.warn('Hero video autoplay muted fallback:', err);
      });
    };
    playHero();
    document.addEventListener('touchstart', playHero, { once: true });
  }

  // ==========================================
  // 3. NAVIGATION DRAWER (Slide-out menu)
  // ==========================================
  const openDrawer = () => {
    navDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    navDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
      drawerLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  if (drawerBookBtn) {
    drawerBookBtn.addEventListener('click', () => {
      closeDrawer();
      openBookingModal();
    });
  }

  // Escape key closes drawer and modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeBookingModal();
    }
  });

  // ==========================================
  // 4. BOOKING MODAL LOGIC
  // ==========================================
  window.openBookingModal = () => {
    bookingModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (bookingConfirmation) bookingConfirmation.classList.remove('show');
    if (bookingForm) bookingForm.style.display = 'block';
  };

  window.closeBookingModal = () => {
    bookingModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.openBookingWithService = (serviceName) => {
    openBookingModal();
    if (bookServiceSelect && serviceName) {
      // Find matching option
      for (let option of bookServiceSelect.options) {
        if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || 
            serviceName.toLowerCase().includes(option.value.toLowerCase())) {
          bookServiceSelect.value = option.value;
          break;
        }
      }
    }
  };

  if (headerScheduleBtn) headerScheduleBtn.addEventListener('click', openBookingModal);
  if (heroScheduleBtn) heroScheduleBtn.addEventListener('click', openBookingModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingModalBackdrop) {
    bookingModalBackdrop.addEventListener('click', (e) => {
      if (e.target === bookingModalBackdrop) closeBookingModal();
    });
  }

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const sName = document.getElementById('bookName').value;
      const sService = document.getElementById('bookService').value;
      const sDate = document.getElementById('bookDate').value;
      const sTime = document.getElementById('bookTime').value;

      document.getElementById('confirmName').textContent = sName;
      document.getElementById('confirmService').textContent = sService;
      document.getElementById('confirmDate').textContent = sDate;
      document.getElementById('confirmTime').textContent = sTime;

      bookingForm.style.display = 'none';
      bookingConfirmation.classList.add('show');
    });
  }

  if (confirmDoneBtn) {
    confirmDoneBtn.addEventListener('click', () => {
      closeBookingModal();
      bookingForm.reset();
      bookingConfirmation.classList.remove('show');
      bookingForm.style.display = 'block';
    });
  }

  // Handle WhatsApp Direct Booking
  if (bookWhatsAppBtn) {
    bookWhatsAppBtn.addEventListener('click', () => {
      const name = document.getElementById('bookName').value.trim() || 'Guest';
      const phone = document.getElementById('bookPhone').value.trim() || 'Not specified';
      const service = document.getElementById('bookService').value || 'Salon Consultation';
      const date = document.getElementById('bookDate').value || 'Upcoming Date';
      const time = document.getElementById('bookTime').value || 'Morning Slot';
      const artist = document.getElementById('bookArtist').value || 'Any Senior Artisan';
      const notes = document.getElementById('bookNotes').value.trim();

      let msg = `*ALPNAAZ AESTHETIC STUDIO - BOOKING REQUEST*%0A%0A`;
      msg += `👤 *Client Name:* ${encodeURIComponent(name)}%0A`;
      msg += `📱 *Phone:* ${encodeURIComponent(phone)}%0A`;
      msg += `✨ *Service:* ${encodeURIComponent(service)}%0A`;
      msg += `📅 *Date:* ${encodeURIComponent(date)}%0A`;
      msg += `⏰ *Slot:* ${encodeURIComponent(time)}%0A`;
      msg += `✂️ *Stylist:* ${encodeURIComponent(artist)}%0A`;
      if (notes) {
        msg += `📝 *Notes:* ${encodeURIComponent(notes)}%0A`;
      }
      msg += `%0A_Please confirm availability for my appointment._`;

      const whatsappUrl = `https://wa.me/919876543210?text=${msg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // ==========================================
  // 5. INTERACTIVE MENU TABS
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.menu-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // ==========================================
  // 6. VIDEO REELS HOVER & AUTOPLAY LOGIC
  // ==========================================
  const reelCards = document.querySelectorAll('.reel-card');
  reelCards.forEach(card => {
    const video = card.querySelector('.reel-video');
    const playIndicator = card.querySelector('.reel-play-indicator');
    if (!video) return;

    // Desktop hover playback
    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
      if (playIndicator) {
        playIndicator.innerHTML = '<i class="fa-solid fa-pause"></i>';
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      if (playIndicator) {
        playIndicator.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });

    // Touch click toggle
    card.querySelector('.reel-video-container')?.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        if (playIndicator) playIndicator.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        video.pause();
        if (playIndicator) playIndicator.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });
  });

  // Intersection Observer to smoothly play videos in viewport on mobile devices
  if ('IntersectionObserver' in window && window.innerWidth <= 768) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target.querySelector('.reel-video');
        if (!vid) return;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.5 });

    reelCards.forEach(c => observer.observe(c));
  }

  // ==========================================
  // 7. QUICK INQUIRY FORM
  // ==========================================
  const inquiryForm = document.getElementById('quickInquiryForm');
  const inquirySuccess = document.getElementById('inquirySuccess');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      inquiryForm.style.opacity = '0.5';
      setTimeout(() => {
        inquiryForm.reset();
        inquiryForm.style.opacity = '1';
        if (inquirySuccess) inquirySuccess.classList.add('show');
        setTimeout(() => {
          if (inquirySuccess) inquirySuccess.classList.remove('show');
        }, 6000);
      }, 500);
    });
  }

  // ==========================================
  // 7b. HIGH-DEFINITION PROCEDURAL FILM-GRAIN
  // ==========================================
  const grainOverlay = document.querySelector('.film-grain-overlay');
  if (grainOverlay) {
    try {
      const gCanvas = document.createElement('canvas');
      gCanvas.width = 160;
      gCanvas.height = 160;
      const gCtx = gCanvas.getContext('2d');
      const gImgData = gCtx.createImageData(160, 160);
      for (let i = 0; i < gImgData.data.length; i += 4) {
        const shade = Math.floor(Math.random() * 255);
        gImgData.data[i] = shade;     // R
        gImgData.data[i + 1] = shade; // G
        gImgData.data[i + 2] = shade; // B
        // Visible, tactile luxury paper grain distribution
        gImgData.data[i + 3] = Math.random() > 0.45 ? Math.floor(Math.random() * 55 + 25) : 0;
      }
      gCtx.putImageData(gImgData, 0, 0);
      grainOverlay.style.backgroundImage = `url("${gCanvas.toDataURL()}")`;
      grainOverlay.style.backgroundRepeat = 'repeat';
      grainOverlay.style.opacity = '0.14';
      grainOverlay.style.mixBlendMode = 'screen';
    } catch (err) {
      console.warn('Procedural grain fallback:', err);
    }
  }

  // ==========================================
  // 8. MINIMALIST LUXURY CUSTOM CURSOR (Desktop)
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorDot && cursorRing && isFinePointer) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    // Direct tracking for dot
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorDot.classList.add('cursor-visible');
        cursorRing.classList.add('cursor-visible');
        ringX = mouseX;
        ringY = mouseY;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth Lerp Animation for Ring
    const renderCursor = () => {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX.toFixed(2)}px`;
        cursorRing.style.top = `${ringY.toFixed(2)}px`;
      }
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.classList.remove('cursor-visible');
      cursorRing.classList.remove('cursor-visible');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorDot.classList.add('cursor-visible');
      cursorRing.classList.add('cursor-visible');
    });

    // Delegated hover interaction for all clickable and text elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .reel-card, .menu-item-card, .tab-btn, .review-card, .b-feat, .stat-box, .sound-toggle-btn');
      const isText = target.closest('h1, h2, h3, .editorial-quote, .hero-eyebrow, .section-subtitle');

      if (isInteractive) {
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
        cursorRing.classList.remove('cursor-text');
        cursorDot.classList.remove('cursor-text');
      } else if (isText) {
        cursorRing.classList.add('cursor-text');
        cursorDot.classList.add('cursor-text');
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      } else {
        cursorRing.classList.remove('cursor-hover', 'cursor-text');
        cursorDot.classList.remove('cursor-hover', 'cursor-text');
      }
    }, { passive: true });
  }
});
