/**
 * @author nibblesky <Nibblesky.com>
 * @description IFDO service modules for React-only Websites. 
 * @version 1.1.3, 2024.12.11 소스 수정 
 * @copyright © Nibblesky.com 2024
 */

import warnlog from './lib/warnlog'
import errorlog from './lib/errorlog'

const jfullscript = {
  _NB_JID     : "",  /* 로그인아이디(필수) */
  _NB_JN      : "",  /* 가입/해지여부(join,withdraw) */
  _NB_ID      : "",  /* 로그인아이디(필수) */
  _NB_EMAIL   : "",  /* 로그인 사용자 이메일주소 */
  _NB_CT      : "",  /* 카테고리명 */
  _NB_PD      : "",  /* 제품명 */
  _NB_PC      : "",  /* 제품코드 */
  _NB_AMT     : 0,  /* 제품가격, 내부검색 결과수 */
  _NB_DAMT    : 0,  /* 상품상세 - 할인가격 적용 */
  _NB_IMG     : "",  /* 제품이미지 */
  _NB_PD_USE  : "",  /* 현재 상품이 품절인 경우 N 값을 넣어주세요 */
  _NB_PM      : "",  /* 장바구니 구분값(u:장바구니),구매완료 구분값(b), 위시리스트 구분값( w:위시리스트) */
  _NB_ORD_NO  : "",  /* 주문번호(임의번호) */
  _NB_ORD_AMT : 0,  /* 주문 총액(숫자) */
  _NB_kwd     : "",  /* 내부검색어 */
  _NB_UDF     : {},  
  _NB_LO      : {
    prodObj   : {},
    push : function(pObj){
      if (typeof pObj === "object" && pObj.PN !== undefined && pObj.PC !== undefined 
          && pObj.CT !== undefined && pObj.AM !== undefined && pObj.PR !== undefined ) {

          var tmpObj = this.prodObj[pObj.PN];
        
          if (tmpObj) {
            pObj.AM += tmpObj.AM;
            pObj.PR += tmpObj.PR;
            this.prodObj[pObj.PN] = pObj;
          } else {
            this.prodObj[pObj.PN] = pObj;
          }

      } else {
        warnlog("_NB_LO 입력 형식에 맞지 않습니다.");
      }
  }},
  timeObj     : {}, 
  /**
   * 초기 GCODE 생성해주는 함수로 매개변수로 받은 gcode를 window 객체에 넘겨준다.
   * 
   * @param {string} gcode 고객사이트의 수집 분석 고유아이디 값
   */
  initialize : function (gcode) {
    if (gcode===undefined || gcode=='' || String(gcode).length<13) {
      errorlog("잘못된 GCODE 입니다.");
      return 0;
    }

    window._NB_gs    = "wlog.ifdo.co.kr";
    window._NB_MKTCD = gcode;

    this.scriptImport();
  },
  /**
   * ifdo-jfullscript 설치 및 pageView 불러오는 함수로 조건문에 맞게 각각 실행한다.
   * 
   * @param {string} PageURL 고객이 직접 설정한 가상 페이지 주소
   */
  scriptImport : function (PageURL) {  

    if (window._IFDO_SCRIPT === undefined){
	    
      window._IFDO_SCRIPT = Math.floor(Date.now()/1000);
      var scriptURL       = "https://script.ifdo.co.kr/jfullscript.js?rnd="+ window._IFDO_SCRIPT;
      var scriptElement   = document.createElement("script");
      scriptElement.src   = scriptURL;
      document.body.appendChild(scriptElement);
      
    } else {
      this.pageView ( PageURL ? PageURL : window.location.pathname + window.location.search );
    }

  },
  /**
   * _NB_PAGE_EVENT가 로드되면 매개변수로 받은 pageURL을 window._NB_PAGE_EVENT 함수로 전달한다.
   * _NB_PAGE_EVENT가 로드되지 않은 경우 경고 메세지를 출력한다.
   * 
   * @param {string} PageURL 고객이 직접 설정한 가상 페이지 주소
   */
  pageView : function (pageURL) {

    if (!pageURL) errorlog("pageURL 이 없습니다.");	

    if (typeof window._NB_PAGE_EVENT === "function") window._NB_PAGE_EVENT(pageURL); 
    else warnlog("_NB_PAGE_EVENT 가 로드 되지 않았습니다.");

    this.resetVar();

  },
  /**
   * 변수의 값이 누적되지 않도록 변수 재설정해주는 함수이며 pageView() 함수 하단에서 호출된다.
   * 
   */
  resetVar : function () {

    this._NB_IMG        = "";
    this._NB_LO.prodObj = {};
    this._NB_JID        = "";
    this._NB_JN         = "";
    this._NB_CT         = "";
    this._NB_PD         = "";
    this._NB_PC         = "";
    this._NB_AMT        = 0;  
    this._NB_DAMT       = 0;
    this._NB_PD_USE     = "";
    this._NB_PM         = "";
    this._NB_ORD_NO     = "";
    this._NB_ORD_AMT    = 0;
    this._NB_kwd        = "";
    
    window._NB_IMG      = "";
    window._NB_LO       = [];
    window._NB_JID      = "";
    window._NB_JN       = "";
    window._NB_CT       = "";
    window._NB_PD       = "";
    window._NB_PC       = "";
    window._NB_AMT      = 0; 
    window._NB_DAMT     = 0;
    window._NB_PD_USE   = "";
    window._NB_PM       = "";
    window._NB_ORD_NO   = "";
    window._NB_ORD_AMT  = 0;
    window._NB_kwd      = "";

  },
  /**
   * 각 페이지마다 호출되는 함수로 고객이 설정한 변수값의 type을 확인하고, 전역 객체인 window 변수에 설정한다.
   * 
   * @param {string} PageIs 각 페이지 이름
   * @param {string} PageURL 고객이 직접 설정한 가상 페이지 주소
   */
  _SEND : function (PageIs, PageURL) {
    
    var curTime = Math.floor(Date.now()/1000); // 현재 시간
    var timeTmpObj = this.timeObj[PageIs]; 

    /*
     5초이내 같은 이벤트는 중복 가능성이 있어 제한하고 있습니다.
     시간( 초단위) 값은 직접 수정하셔서 사용하시기 바랍니다.
    */
    if(timeTmpObj && (curTime - timeTmpObj) < 5) {
      this.resetVar();
      return 0;
    }
    else this.timeObj[PageIs] = curTime; 
    
    console.log("IFDO SEND code is completed : ", PageIs);

    this.strValidNotice("_NB_ID");
    this.strValidNotice("_NB_EMAIL");
    this.objValidNotice("_NB_UDF");

    switch (PageIs) {

      case "join":
      case "withdraw":
        this.strValidNotice("_NB_JID");
        window._NB_JN = PageIs;
        break;
      case "prodDetail":
        this.strValidNotice("_NB_CT");
        this.strValidNotice("_NB_PD");
        this.strValidNotice("_NB_PC");
        this.intValidNotice("_NB_AMT");
        this.intValidNotice("_NB_DAMT");
        this.imgValidMetaTag("_NB_IMG");
        this.strValidNotice("_NB_PD_USE");
        break;
      case "cart":
        this.objGlobalProd("u");
        break;
      case "order":
        this.strValidNotice("_NB_ORD_NO");
        this.intValidNotice("_NB_ORD_AMT");
        this.objGlobalProd("b");
        break;
      case "orderform":
        this.objGlobalProd("f");
        break;
      case "prodSearch":
        this.strValidNotice("_NB_kwd");
        this.intValidNotice("_NB_AMT");
        break;
      case "wishList":
        this.objGlobalProd("w");
        break;
    }
    if( PageURL !== undefined && PageURL != '') {
      this.scriptImport(PageURL);
      console.log("IFDO SEND PageURL is completed : ", PageURL);
    }
  },
  /**
   * 상품 정보가 담긴 객체를 window 객체에 설정하며 _send() 함수에서 호출된다. 
   * 
   * @param {string} mode 문자열 변수(w:위시리스트 ,b:구매 ,u:장바구니, f:주문서작성 )
   */
  objGlobalProd : function(mode) { 
    window._NB_PM = mode;
    window._NB_LO = Object.values(this._NB_LO.prodObj); 
  },
  /**
   * 문자열 변수 값이 유효성 검증이 되면 window 객체에 값을 설정하고, 검증되지 않으면 경고메세지를 출력한다.
   * 
   * @param {string} mName 문자열 변수
   */
  strValidNotice : function (mName) {

    if (typeof this[mName] == "string" ){
      if ( this[mName] != "") window[mName] = this[mName] ;
    } 
    else {
      warnlog(`${mName} 이(가) 문자 형식이 아닙니다.`);
    }
     
  },
  /**
   * 정수형 변수 값이 유효성 검증이 되면 window 객체에 값을 설정하고, 검증되지 않으면 경고메세지를 출력한다.
   * 
   * @param {string} mName 정수형 변수
   */
  intValidNotice : function (mName) {

    if (typeof this[mName] == "number"){
      if (this[mName] != 0) window[mName] = this[mName];
    } 
    else {
      warnlog(`${mName} 이(가) 숫자 형식이 아닙니다.`);
    }

  },
  /**
   * 객체형 변수 값이 유효성 검증이 되면 window 객체에 값을 설정하고, 검증되지 않으면 경고메세지를 출력한다.
   * 
   * @param {string} mName 객체형 변수
   */
  objValidNotice : function (mName) {

    if (typeof this[mName] == "object"){
      if (Object.keys(mName).length > 0) window[mName] = this[mName];
    } 
    else {
       warnlog(`${mName} 이(가) 객체 형식이 아닙니다.`);
    }

  },
  /**
   * 고객이 직접 설정한 이미지 주소가 있으면 유효성 검증 후 window 객체에 값을 설정한다.
   * 직접 설정한 주소값이 없으면 meta값에 설정되어 있는 값을 불러와 window 객체에 값을 설정한다.
   * 
   * @param {string} mName 고객이 직접 설정한 이미지 주소
   */
  imgValidMetaTag : function(mName) {

    if(typeof this[mName] === "string" && this[mName].length > 5){
      window[mName] = this[mName];
    } else {    

      var metas = document.getElementsByTagName("meta");

      for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('property') == 'og:image') {
          window[mName] = metas[i].getAttribute("content");
          break;
        }
      }
    }
  },
};

module.exports = jfullscript
