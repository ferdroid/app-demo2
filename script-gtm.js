<script>
(function () {
  var styles =
    'pxti-cash-financing-modal .suggestion-section { max-width: 320px; margin: 0 auto; }' +
    'pxti-cash-financing-modal .suggestion-list { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; list-style: none; margin: 1rem 0; padding: 0; }' +
    'pxti-cash-financing-modal .suggestion-list li.suggestion-item { border-radius: 1rem; box-shadow: 0 0 4px 0 rgba(82, 112, 148, 0.2), 0 1px 1px 0 rgba(82, 112, 148, 0.12), 0 1px 1px 0 rgba(82, 112, 148, 0.14); color: var(--primary-700); cursor: pointer; display: inline-block; font-weight: 700; line-height: 4; min-height: 4rem; min-width: 75px; padding: .25rem 1rem; transition: background-color 0.3s ease; text-align: center; position: relative; }' +
    'pxti-cash-financing-modal .suggestion-list span.suggestion-item__check { display: none; width: 8px; height: 8px; background-color: var(--secondary-500); border-radius: 50%; position: absolute; top: 10px; right: 12px; outline: 2px solid var(--secondary-500); outline-offset: 2px; }' +
    'pxti-cash-financing-modal .suggestion-list li.suggestion-item--selected .suggestion-item__check { display: block; }' +
    'pxti-cash-financing-modal .suggestion-list li.suggestion-item--selected { outline: 3px solid var(--secondary-500); }' +
    'pxti-cash-financing-modal .input-info-section { margin-top: 1rem; padding: .75rem; border-radius: 1rem; background-color: var(--attention-light, #f5f8ff); font-size: 0.875rem; }' +
    'pxti-cash-financing-modal .input-info-section p { margin-bottom: 0.5rem; }' +
    'pxti-cash-financing-modal .input-info-section p:last-child { margin-bottom: 0; }' +
    '@media (max-width: 575.98px) { .bcp-modal-host-4-15-0.dialog-backdrop .bcp-ffw-modal-dialog { max-width: 22em; } }';

  var state = JSON.parse(localStorage.getItem('pxti'));
  var STATE = {
    purchaseAmount: state.purchase.purchaseAmountRaw,
    maxFinancingAmount: state.purchase.maxFinancingAmount,
    cefAmount: state.purchase.maxFinancingAmount - state.purchase.purchaseAmountRaw,
    currency: state.purchase.currencyRaw,
    currencySymbol: ''
  };

  var CEFSuggestionsRules = {
    getAmounts: function (lead, purchaseAmount) {
      var SUGGESTIONS_RULES = [
        { minFinancingAmount: 100, maxFinancingAmount: 5000, minPurchaseAmount: 100, maxPurchaseAmount: 4900, suggestions: [30, 50, 100] },
        { minFinancingAmount: 5000.01, maxFinancingAmount: 20000, minPurchaseAmount: 100, maxPurchaseAmount: 5000, suggestions: [10, 30, 50] },
        { minFinancingAmount: 5000.01, maxFinancingAmount: 20000, minPurchaseAmount: 5000, maxPurchaseAmount: 20000, suggestions: [20, 50, 80] },
        { minFinancingAmount: 20000.01, maxFinancingAmount: 350000, minPurchaseAmount: 0, maxPurchaseAmount: 5000, suggestions: [5, 20, 40] },
        { minFinancingAmount: 20000.01, maxFinancingAmount: 350000, minPurchaseAmount: 5000, maxPurchaseAmount: 50000, suggestions: [15, 30, 50] }
      ];

      var rule = SUGGESTIONS_RULES.find(function (suggestion) {
        return lead >= suggestion.minFinancingAmount &&
          lead <= suggestion.maxFinancingAmount &&
          purchaseAmount >= suggestion.minPurchaseAmount &&
          purchaseAmount <= suggestion.maxPurchaseAmount;
      });

      return rule.suggestions.map(function (suggestion) {
        return suggestion * (STATE.cefAmount / 100);
      });
    }
  }

  var CEFSuggestions = {
    EXP_SESSION_KEY: 'EXP_CEF_SUGG',
    financingAmountInput: null,
    changeHeaderText: function (modal) {
      var textHeader = modal.querySelector('bcp-modal-header p');
      textHeader.style.fontSize = '18px';
      textHeader.innerHTML = 'El monto de tu compra es de <br/> <span style="display: inline-block;" class="pxti-badge pxti-badge--secondary pxti-badge--xl mt-2">' +
        STATE.currencySymbol + Utils.getFormattedNumber(STATE.purchaseAmount, 2) +
        '</span>';
    },
    changeButtonTexts: function (modal) {
      var buttons = modal.querySelectorAll('bcp-modal-footer button span');
      buttons[0].textContent = 'Solo comprar';
    },
    getInputTitle: function () {
      var title = document.createElement('bcp-paragraph');
      title.className = 'text-center mt-4 mb-2';
      title.innerHTML = 'Además, añade un préstamo <br/> <b>adicional a tu compra</b>';
      return title;
    },
    selectDefaultSuggestion: function (suggestionsSection) {
      setTimeout(function () {
        var secondSuggestion = suggestionsSection.querySelector('.suggestion-item:nth-child(2)');
        secondSuggestion.click();
      }, 10);
    },
    setCEFAmount: function (newCEFAmount) {
      pxtiGetElementBySelector('#cef-amount-input input', function (cefInput) {
        setTimeout(function () {
          cefInput.value = Utils.getFormattedNumber(newCEFAmount);
          cefInput.dispatchEvent(new Event('input'));
          var bcpCEFInfput = document.querySelector('#cef-amount-input');
          if (bcpCEFInfput) {
            bcpCEFInfput.setAttribute('state', '');
          }
        }, 10);
      }, 10);
    },
    setFinancingAmount: function (newFinancingAmount) {
      setTimeout(function () {
        CEFSuggestions.financingAmountInput.value = Utils.getFormattedNumber(newFinancingAmount, 2);
        CEFSuggestions.financingAmountInput.dispatchEvent(new Event('input'));
      }, 10);
    },
    unselectAllSuggestionItems: function () {
      document.querySelectorAll('.suggestion-item').forEach(function (item) {
        item.classList.remove('suggestion-item--selected');
      });
    },
    getAmountCards: function (amounts) {
      var suggestionList = document.createElement('ul');
      suggestionList.className = 'suggestion-list';

      var onClickSuggestionsCardUtils = {
        unselectSuggestionItems: function (suggestionItem) {
          suggestionList.querySelectorAll('.suggestion-item').forEach(function (item) {
            if (item !== suggestionItem) item.classList.remove('suggestion-item--selected');
          });
        },
        selectSuggestionItem: function (suggestionItem) {
          setTimeout(function () { suggestionItem.classList.add('suggestion-item--selected') }, 10);
        },
        setNewSuggestionAmountFromCard: function (newCEFAmount) {
          CEFSuggestions.setCEFAmount(newCEFAmount);

          var newFinancingAmount = STATE.purchaseAmount + newCEFAmount;
          CEFSuggestions.setFinancingAmount(newFinancingAmount);
        }
      }

      amounts.forEach(function (amount, index) {
        var suggestionItem = document.createElement('li');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = STATE.currencySymbol + ' ' + Utils.getFormattedNumber(amount);

        var checkmarkIcon = document.createElement('span');
        checkmarkIcon.className = 'suggestion-item__check';
        suggestionItem.appendChild(checkmarkIcon);

        suggestionItem.addEventListener('click', function () {
          var integerAmount = parseInt(amount);
          onClickSuggestionsCardUtils.unselectSuggestionItems(suggestionItem);
          onClickSuggestionsCardUtils.selectSuggestionItem(suggestionItem);
          onClickSuggestionsCardUtils.setNewSuggestionAmountFromCard(integerAmount);
          CEFSuggestions.setInputInfoSection(integerAmount);

          dataLayer.push({
            event: 'EXP_CHK_OFERTA_CEF_SUG_' + (index + 1),
            tipoZona: 'Cuotéalo',
            pagePath: '/oferta',
            timeStamp: new Date().getTime().toString(),
            userId: state.customer.profileId
          });
        });

        suggestionList.appendChild(suggestionItem);
      });

      return suggestionList;
    },
    getStyles: function () {
      var suggestionStyle = document.createElement('style');
      suggestionStyle.setAttribute('type', 'text/css');
      suggestionStyle.textContent = styles;

      return suggestionStyle;
    },
    getBottomTitle: function () {
      var bottomTitle = document.createElement('bcp-paragraph');
      bottomTitle.className = 'text-center mt-4';
      bottomTitle.setAttribute('family', 'bold');
      bottomTitle.setAttribute('color', 'primary-700');
      bottomTitle.innerHTML = '¿Quieres este préstamo?';
      return bottomTitle;
    },
    getCEFInputSection: function (shouldShowSuggestions) {
      var cefInputSection = document.createElement('section');
      cefInputSection.className = 'cef-input-section';
      var cefInput = CEFSuggestions.getCEFInput();

      if (shouldShowSuggestions) {
        var title = document.createElement('bcp-paragraph');
        title.className = 'text-center mt-2';
        title.setAttribute('family', 'bold');
        title.setAttribute('color', 'secondary-500');
        title.setAttribute('style', 'cursor: pointer;');
        title.textContent = 'Quiero otro monto';
        title.addEventListener('click', function () {
          title.style.display = 'none';
          cefInputSection.appendChild(cefInput);
          dataLayer.push({
            event: 'EXP_CHK_OFERTA_CEF_SUG_OTRO',
            tipoZona: 'Cuotéalo',
            pagePath: '/oferta',
            timeStamp: new Date().getTime().toString(),
            userId: state.customer.profileId
          });
        });

        cefInputSection.appendChild(title);
      } else {
        cefInputSection.appendChild(cefInput);
      }

      return cefInputSection;
    },
    getCEFInput: function () {
      var cefInput = document.createElement('bcp-input');
      cefInput.setAttribute('id', 'cef-amount-input');
      cefInput.setAttribute('type', 'text');
      cefInput.setAttribute('label', 'Monto adicional');
      cefInput.setAttribute('inputmode', 'numeric');
      cefInput.setAttribute('message', 'Mínimo S/ 1 hasta ' + STATE.currencySymbol + ' ' + Utils.getFormattedNumber(STATE.cefAmount));
      cefInput.className = 'input-cef';

      var cefEventsHandlers = {
        onKeyup: function (event) {
          CEFSuggestions.unselectAllSuggestionItems();

          var newCEFAmount = parseFloat(event.target.value);
          var isInvalid = newCEFAmount === 0 || Number.isNaN(newCEFAmount);

          event.target.value = isInvalid ? '' : newCEFAmount;

          var isAmountValid = newCEFAmount <= STATE.cefAmount && newCEFAmount >= 1;
          CEFSuggestions.setFinancingAmount(isAmountValid ? STATE.purchaseAmount + newCEFAmount : 0)
          CEFSuggestions.setInputInfoSection(isAmountValid ? newCEFAmount : 0);

          cefInput.setAttribute('state', isAmountValid ? '' : 'error');
        },
        onKeydown: function (event) {
          var isValidKey = event.ctrlKey || event.metaKey ||
            event.key === 'Backspace' ||
            event.key === 'Tab' ||
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight' ||
            event.key === 'Delete' ||
            event.key === 'Home' ||
            event.key === 'End';
          var isNumberKey = /[0-9]/.test(event.key);

          if (isValidKey || isNumberKey) return;

          event.preventDefault();
        },
        onFocusOut: function (event) {
          var amount = parseFloat(event.target.value.replace(/[,]/g, '')) || 0;
          var formattedAmount = amount > 0 ? Utils.getFormattedNumber(amount) : '';
          event.target.value = formattedAmount;
        },
        onFocusIn: function (event) {
          event.target.value = parseFloat(event.target.value.replace(/[,]/g, '')) || '';
        }
      }

      cefInput.addEventListener('keydown', cefEventsHandlers.onKeydown);
      cefInput.addEventListener('keyup', cefEventsHandlers.onKeyup);

      cefInput.addEventListener('focusout', cefEventsHandlers.onFocusOut);

      cefInput.addEventListener('focusin', cefEventsHandlers.onFocusIn);

      return cefInput;
    },
    getSummaryMessageSection: function (suggestionAmount) {
      var infoSection = document.createElement('section');
      infoSection.className = 'input-info-section';

      var purchaseInfo = document.createElement('p');
      purchaseInfo.innerHTML = '🛒 <b>' +
        STATE.currencySymbol + ' ' + Utils.getFormattedNumber(STATE.purchaseAmount, 2) +
        '</b> serán para tu compra';

      var cefInfo = document.createElement('p');
      cefInfo.innerHTML = '💵 <b>' +
        STATE.currencySymbol + ' ' + Utils.getFormattedNumber(suggestionAmount) +
        '</b> a tu cuenta para lo que quieras ';

      infoSection.appendChild(purchaseInfo);
      infoSection.appendChild(cefInfo);

      return infoSection;
    },
    setInputInfoSection: function (cefAmount) {
      var infoSection = document.querySelector('.input-info-section');

      if (cefAmount === 0) {
        infoSection.style.opacity = '0';
      }

      if (cefAmount > 0) {
        infoSection.style.opacity = '1';
        var cefInfo = infoSection.querySelector('p:nth-child(2)');
        cefInfo.innerHTML = '💵 <b>' +
          STATE.currencySymbol + ' ' + Utils.getFormattedNumber(cefAmount) +
          '</b> a tu cuenta para lo que quieras ';
      }
    },
  };

  var ModalUtils = {
    hide: function () {
      var hideModalStyle = document.createElement('style');
      hideModalStyle.setAttribute('type', 'text/css');
      hideModalStyle.setAttribute('id', 'hide-modal-style');
      hideModalStyle.textContent = 'pxti-cash-financing-modal { display: none !important; }';
      document.head.appendChild(hideModalStyle);
    },
    show: function () {
      setTimeout(function () {
        var hideModalStyle = document.querySelectorAll('#hide-modal-style');
        hideModalStyle.forEach(function (style) {
          document.head.removeChild(style);
        });
      }, 200);
    }
  }

  var Utils = {
    getFormattedNumber: function (value, decimals) {
      if (!decimals)
        return parseInt(value).toLocaleString('es-PE');

      return value.toLocaleString('es-PE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, });
    },
    getCurrencySymbol: function (currency) {
      if (currency === 'PEN') return 'S/';
      if (currency === 'USD') return '$';
      return 'UNKNOWN_CURRENCY';
    }
  }

  function changeCEFModal(modal, shouldShowSuggestions) {
    // var modalBody = modal.querySelector('.body-content');
    pxtiGetElementBySelector('.bcp-ffw-modal-body .body-content', function (modalBody) {
      modalBody.querySelectorAll('section').forEach(function (section) {
        section.style.display = 'none';
      });


      pxtiGetElementBySelector('.bcp-ffw-modal-body .body-content input', function (financingAmountInput) {
        console.log('Encontró financingAmountInput', financingAmountInput)
        // var financingAmountInput = modalBody.querySelector('input');
        CEFSuggestions.financingAmountInput = financingAmountInput;
        var amounts = CEFSuggestionsRules.getAmounts(STATE.maxFinancingAmount, STATE.purchaseAmount);

        var suggestionsSection = document.createElement('section');
        suggestionsSection.className = 'suggestion-section';

        CEFSuggestions.changeHeaderText(modal);
        CEFSuggestions.changeButtonTexts(modal);
        console.log('Texto previos modificados');

        suggestionsSection.appendChild(CEFSuggestions.getStyles());
        suggestionsSection.appendChild(CEFSuggestions.getInputTitle());

        if (shouldShowSuggestions) {
          suggestionsSection.appendChild(CEFSuggestions.getAmountCards(amounts));
          console.log('Cards de sugerencias insertados');
        }

        suggestionsSection.appendChild(CEFSuggestions.getCEFInputSection(shouldShowSuggestions));
        console.log('Sección de input CEF insertada');

        var defaultSuggestionAmount = shouldShowSuggestions ? amounts[1] : STATE.cefAmount;
        suggestionsSection.appendChild(CEFSuggestions.getSummaryMessageSection(defaultSuggestionAmount));
        console.log('Sección de mensaje resumen insertada');

        suggestionsSection.appendChild(CEFSuggestions.getBottomTitle());
        console.log('Titulo inferior insertado');

        modalBody.prepend(suggestionsSection);

        if (shouldShowSuggestions) {
          CEFSuggestions.selectDefaultSuggestion(suggestionsSection);
        }

        if (!shouldShowSuggestions) {
          CEFSuggestions.setCEFAmount(STATE.cefAmount);
        }

        ModalUtils.show();

        sessionStorage.setItem(CEFSuggestions.EXP_SESSION_KEY, 'OK');
        console.log('Experimento CEFSuggestions insertado');
      }, 10);

    }, 10);
  }

  setTimeout(function () {
    var ENVIRONMENTS = [
      'localhost',
      'azurewebsites.net',
      'cuotealocert.viabcp.com',
      'www.cuotealo.viabcp.com',
    ];
    var isCEFAmountValid = STATE.cefAmount >= 1;

    var some = ENVIRONMENTS.some(function (env) { return window.location.hostname.includes(env) });
    if (some && isCEFAmountValid) {
      pxtiGetElementBySelector('.additional-cash-banner', function (banner) {
        STATE.currencySymbol = Utils.getCurrencySymbol(STATE.currency);
        banner.querySelector("span").innerText = "¿Necesitas más efectivo? Obtén un préstamo adicional aquí";
        banner.addEventListener('click', function () {
          ModalUtils.hide();

          setTimeout(function () {
            pxtiGetElementBySelector('pxti-cash-financing-modal', function (modal) {
              changeCEFModal(modal, false);
            }, 10);
          }, 500);

          dataLayer.push({
            event: 'EXP_CHK_OFERTA_CEF_A',
            tipoZona: 'Cuotéalo',
            pagePath: '/oferta',
            timeStamp: new Date().getTime().toString(),
            userId: state.customer.profileId
          });
        });
 
 
      }, 200);

    }
  }, 200);
})();
</script>