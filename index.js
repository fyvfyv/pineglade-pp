export default () => {
  if (!window) {
    return;
  }

  const PP_CLASS = 'pineglade-pp'
  const DEFAUL_PAGE = 'index';
  const DEFAULT_BREAKPOINTS = [320, 768, 1260];
  const DEFAULT_FOLDER = 'pixelperfect';
  const DEFAULT_EXT = 'jpg';

  const sortBP = (a, b) => a - b;

  class Pixelperfect {
    constructor() {
      const {
        page = null,
        breakpoints = null,
        folder = DEFAULT_FOLDER,
        ext = DEFAULT_EXT
      } = window.pinegladePP || {};

      this._isPP = Boolean(Number(localStorage.getItem('pp') || 0));
      this._isInvert = Boolean(Number(localStorage.getItem('ppInvert') || 1));

      this._breakpoints = breakpoints ? Array.from(new Set(breakpoints)).sort(sortBP) : DEFAULT_BREAKPOINTS;
      this._currentBreakpoint = 0;
      this._folder = folder;
      this._ext = ext;

      if (!page) {
        const [, currentPage = null] = window.location.pathname.match(/^\/?(.*?)(\.html?)?$/) || [];
        this._page = currentPage || DEFAUL_PAGE;
      } else {
        this._page = page;
      }

      this._offsets = JSON.parse(localStorage.getItem('ppOffsets')) || {};
      if (!this._offsets[this._page]) {
        this._offsets[this._page] = {};
        for (const breakpoint of this._breakpoints) {
          this._offsets[this._page][breakpoint] = [0, 0];
        }
        this._saveOffsets();
      }

      this._keydownHandler = this._keydownHandler.bind(this);
      this._changeScreenMode = this._changeScreenMode.bind(this);

      this._changeScreenMode();
      this._setOffsets();
      this._managePP();
      this._manageInvert();

      window.addEventListener('resize', this._changeScreenMode);
      document.addEventListener('keydown', this._keydownHandler);
    }

    _changeScreenMode() {
      const { clientWidth } = document.body;
      let currentBreakpoint = 0;
      for (const breakpoint of this._breakpoints) {
        if (clientWidth >= breakpoint) {
          currentBreakpoint = breakpoint;
        }
      }
      if (this._currentBreakpoint !== currentBreakpoint) {
        this._currentBreakpoint = currentBreakpoint;
        this._setBgProperty(this._currentBreakpoint);
        this._setOffsets();
      }
    }

    _keydownHandler(evt) {
      if (document.activeElement !== document.body) {
        return;
      }

      if (evt.code === 'KeyP') {
        evt.preventDefault();
        this._isPP = !this._isPP;
        this._managePP();
      } else if (this._isPP && evt.code === 'KeyI') {
        this._isInvert = !this._isInvert;
        this._manageInvert();
      } else if (this._isPP && evt.code === 'KeyR') {
        localStorage.removeItem('ppOffsets');
        window.location.reload();
      } else if (this._isPP && evt.code === 'ArrowUp') {
        evt.preventDefault();
        this._movePP(0, -1);
      } else if (this._isPP && evt.code === 'ArrowDown') {
        evt.preventDefault();
        this._movePP(0, 1);
      } else if (this._isPP && evt.code === 'ArrowLeft') {
        evt.preventDefault();
        this._movePP(-1, 0);
      } else if (this._isPP && evt.code === 'ArrowRight') {
        evt.preventDefault();
        this._movePP(1, 0);
      }
    }

    _managePP() {
      if (this._isPP) {
        document.body.classList.add(PP_CLASS);
      } else {
        document.body.classList.remove(PP_CLASS);
      }

      localStorage.setItem('pp', Number(this._isPP));
    }

    _manageInvert() {
      document.body.style.setProperty(`--pp-filter`, this._isInvert ? 'invert(1)' : 'none');
      localStorage.setItem('ppInvert', Number(this._isInvert));
    }

    _movePP(x, y) {
      this._offsets[this._page][this._currentBreakpoint][0] += x;
      this._offsets[this._page][this._currentBreakpoint][1] += y;
      this._saveOffsets();
      this._setOffsets();
    }

    _saveOffsets() {
      localStorage.setItem('ppOffsets', JSON.stringify(this._offsets));
    }

    _setBgProperty(breakpoint = 0) {
      const bg = breakpoint ? `url(${this._folder}/${this._page}-${breakpoint}.${this._ext})` : 'none';
      document.body.style.setProperty(`--pp-img`, bg);
    }

    _setOffsets() {
      const [x = 0, y = 0] = this._offsets[this._page][this._currentBreakpoint] || [];
      document.body.style.setProperty('--pp-offset-x', `${x}px`);
      document.body.style.setProperty('--pp-offset-y', `${y}px`);
    }
  }

  document.head.insertAdjacentHTML('beforeend', `<style>.pineglade-pp{position:relative;overflow-x:hidden}.pineglade-pp::after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;z-index:1000000;background-image:var(--pp-img);background-repeat:no-repeat;background-position:50% 0;transform:translate(var(--pp-offset-x),var(--pp-offset-y));opacity:.5;filter:var(--pp-filter);pointer-events:none}</style>`);

  new Pixelperfect();
}
