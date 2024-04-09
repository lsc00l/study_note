
/*######################################
    Jquery Function Extension
######################################*/

( function( $ ) {
    "use strict";

    // -- input filter --
    $.fn.inputFilter = function (inputFilter) {
        // return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
        return this.on("input keydown keyup", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
        // Install input filters.
        // $("#intTextBox").inputFilter(function (value) { return /^-?\d*$/.test(value); });
        // $("#uintTextBox").inputFilter(function (value) { return /^\d*$/.test(value); });
        // $("#intLimitTextBox").inputFilter(function (value) { return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });
        // $("#floatTextBox").inputFilter(function (value) { return /^-?\d*[.,]?\d*$/.test(value); });
        // $("#currencyTextBox").inputFilter(function (value) { return /^-?\d*[.,]?\d$/.test(value); });
        // $("#hexTextBox").inputFilter(function (value) { return /^[0-9a-f]*$/i.test(value); });
    }

    // -- input focus timer --
    $.fn.timeFocus = function(ms) {
        let _ref = this;
        setTimeout(function(){
            $(_ref).focus();
        }, ms);
    };

    // -- panel data flush --
    $.fn.flushPanel = function() {

        let rtnJson = {};

        $( this ).find( 'input, select, textarea, span, th, td, ul' ).each( function() {
            if( $( this ).attr( "name" ) ) {
                switch( $( this ).prop( "tagName" ).toLowerCase() ) {
                    case 'ul' :
                        if( $( this ).children('li:selected') ) {
                            rtnJson[$( this ).attr( "name" )] = $( this ).children("li.selected" ).attr('data-value') ;
                        } else {
                            if( !rtnJson[$( this ).attr( "name" )] ) {
                                rtnJson[$( this ).attr( "name" )] = "";
                            }
                        }
                        break;

                    case 'input':
                        switch( $( this ).attr( "type" ).toLowerCase() ) {
                            case 'button':
                                break;
                            case 'radio':
                                if( $( this ).is( ":checked" ) ) {
                                    rtnJson[$( this ).attr( "name" )] = $( this ).val();
                                } else {
                                    if( !rtnJson[$( this ).attr( "name" )] ) {
                                        rtnJson[$( this ).attr( "name" )] = "";
                                    }
                                }
                                break;
                            case "checkbox":
                                if( $( this ).is( ":checked" ) ) {
                                    if( rtnJson.hasOwnProperty( $( this ).attr( "name" ) ) ) {
                                        if( rtnJson[$( this ).attr( "name" )] != "" ) {
                                            rtnJson[$( this ).attr( "name" )] += ",";
                                        }
                                        rtnJson[$( this ).attr( "name" )] += $( this ).val();
                                    } else {
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val();
                                    }
                                } else {
                                    // 단일 혹은 그룹체크에서 모두 체크가 안되었을경우 jsonData 에 항목이 누락되는걸 방지하기 위
                                    if( !rtnJson[$( this ).attr( "name" )] ) {
                                        rtnJson[$( this ).attr( "name" )] = "";
                                    }
                                }
                                break;
                            default:    // TEXT , HIDDEN , PASSWORD
                                switch( $( this ).attr( "data-format" ) ) {
                                    case "float":
                                        if( $( this ).text().length > 0) {
                                            rtnJson[$( this ).attr( "name" )] = $( this ).text().toFloat( 2 );
                                        } else {
                                            rtnJson[$( this ).attr( "name" )] = $( this ).val().htmlEnc();
                                        }

                                        break;
                                    case "rate":
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val().toDecimal( 2 );
                                        break;
                                    case "money":
                                    case "number":
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val().toNumber();
                                        break;
                                    case "no":
                                    case "tel_no":
                                    case "biz_no":
                                    case "zip_no":
                                    case "card_no":
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val().forceNumber();
                                        break;
                                    case "ym":
                                        rtnJson[$( this ).attr( "name" )] = svc.flushYm( $( this ).val() );
                                        break;
                                    case "date":
                                        rtnJson[$( this ).attr( "name" )] = svc.flushDate( $( this ).val() );
                                        break;
                                    case "time":
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val().forceNumber();
                                        break;
                                    case "dttm":
                                        rtnJson[$( this ).attr( "name" )] = svc.flushDttm( $( this ).val() );
                                        break;
                                    case "dttmms":
                                        rtnJson[$( this ).attr( "name" )] = svc.flushDttmms( $( this ).val() );
                                        break;
                                    default:
                                        rtnJson[$( this ).attr( "name" )] = $( this ).val().htmlEnc();
                                        break;
                                }
                                break;
                        }
                        break;
                    case "select":
                        rtnJson[$( this ).attr( "name" )] = $( this ).val();
                        break;
                    case "textarea":
                        rtnJson[$( this ).attr( "name" )] = $( this ).val().htmlEnc();
                        break;
                    case "span":
                    case "th":
                    case "td":
                        switch( $( this ).attr( "data-format" ) ) {
                            case "float":
                                if( $( this ).text().length > 0) {
                                    rtnJson[$( this ).attr( "name" )] = $( this ).text().toFloat( 2 );
                                } else {
                                    rtnJson[$( this ).attr( "name" )] = $( this ).val().htmlEnc();
                                }
                                break;
                            case "rate":
                                rtnJson[$( this ).attr( "name" )] = $( this ).text().toDecimal( 2 );
                                break;
                            case "money":
                            case "number":
                                rtnJson[$( this ).attr( "name" )] = $( this ).text().toNumber();
                                break;
                            case "no":
                            case "tel_no":
                            case "biz_no":
                            case "zip_no":
                            case "card_no":
                            case "time":
                                rtnJson[$( this ).attr( "name" )] = $( this ).text().forceNumber();
                                break;
                            case "ym":
                                rtnJson[$( this ).attr( "name" )] = svc.flushYm( $( this ).text() );
                                break;
                            case "date":
                                rtnJson[$( this ).attr( "name" )] = svc.flushDate( $( this ).text() );
                                break;
                            case "dttm":
                                rtnJson[$( this ).attr( "name" )] = svc.flushDttm( $( this ).text() );
                                break;
                            case "dttmms":
                                rtnJson[$( this ).attr( "name" )] = svc.flushDttmms( $( this ).text() );
                                break;
                            default:
                                rtnJson[$( this ).attr( "name" )] = $( this ).text().htmlEnc();
                                break;
                        }
                        break;
                    default :
                        break;
                }
            }

        } );

        return rtnJson;
    };


    // -- panel data binding --
    $.fn.bindPanel = function( jsonData ) {

        let panelId = $( this ).attr( 'id' );

        // console.log( 'bindPanel() > panelId, jsonData', panelId, jsonData );

        $( this ).find( 'div, input, select, textarea, span, th, td, ul' ).each( function() {

            if( typeof ( $( this ).attr( "name" ) ) != 'undefined' ) {

                let tagName = $( this ).prop( "tagName" ).toLowerCase();
                let dataKey = $( this ).attr( "name" );

                // data 가 존재할때만 bind 한다.
                if( typeof ( jsonData[dataKey] ) != 'undefined' ) {

                    let value = String( jsonData[dataKey] );
                    if(jsonData[dataKey]  == null) value = '';

                    switch( tagName ) {
                        case 'ul':
                            $( '#' + panelId + ' ul[name=' + dataKey + ']' ).children("li").each( function() {
                                if( $( this ).hasClass( "selected" ) ) $( this ).removeClass( "selected" );
                            } );
                            if( value != '' ) {
                                $( '#' + panelId + ' ul[name=' + dataKey + ']' ).children("li").each( function() {
                                    if( value == $( this ).attr('data-value') ) {
                                        $( this ).addClass( "selected" );
                                    }
                                });
                            }
                            break;
                        case 'button':
                            break;
                        case 'input':
                            switch( $( this ).attr( "type" ).toLowerCase() ) {
                                case 'button':
                                    break;
                                case 'radio':
                                    if( value != '' ) {
                                        if( $( this ).val() == value ) {
                                            $( this ).prop( "checked", true );
                                            // $( this ).trigger( "change");  //TO-DO : jiyun
                                        }
                                    }
                                    break;
                                case "checkbox":
                                    $( '#' + panelId + ' input[name=' + dataKey + ']' ).each( function() {
                                        $( this ).prop( "checked", false );
                                        // $( this ).trigger( "change");  //TO-DO : jiyun
                                    } );
                                    if( value != '' ) {
                                        let arrValue = value.split( ',' );
                                        for( let i = 0; i < arrValue.length; i++ ) {
                                            $( '#' + panelId + ' input[name=' + dataKey + ']' ).each( function() {
                                                if( arrValue[i] == $( this ).val() ) {
                                                    $( this ).prop( "checked", true );
                                                    // $( this ).trigger( "change");  //TO-DO : jiyun
                                                }
                                            } );
                                        }
                                    }
                                    break;
                                case 'text' :
                                    switch( $( this ).attr( "data-format" ) ) {
                                        case "float":
                                            // console.log("DEBUG) value, ", value)
                                            if(value.toString().length > 0) {
                                                $( this ).val( value.formatFloat( 2 ) );
                                            } else {
                                                $( this ).val( "" );
                                            }
                                            break;
                                        case "rate":
                                            $( this ).val( value.formatDecimal( 2 ) );
                                            break;
                                        case "money":
                                        case "number":
                                            $( this ).val( value.toString().formatNumber() );
                                            break;
                                        case "no":
                                            $( this ).val( value.forceNumber() );
                                            break;
                                        case "tel_no":
                                            $( this ).val( value.formatTelNo() );
                                            break;
                                        case "biz_no":
                                            $( this ).val( value.formatBizNo() );
                                            break;
                                        case "zip_no":
                                            $( this ).val( value.formatZipNo() );
                                            break;
                                        case "card_no":
                                            $( this ).val( value.formatCardNo() );
                                            break;
                                        case "date":
                                            $( this ).val( svc.bindDttm( value ).formatDate() );
                                            break;
                                        case "time":
                                            $( this ).val( value.formatTime() );
                                            break;
                                        case "ym":
                                            $( this ).val( svc.bindYm( value ).formatYm() );
                                            break;
                                        case "dttm10":
                                            $( this ).val( svc.bindDttm( value ).formatDttm10() );
                                            break;
                                        case "dttm12":
                                            $( this ).val( svc.bindDttm( value ).formatDttm12() );
                                            break;
                                        case "dttm":
                                        case "dttm14":
                                            $( this ).val( svc.bindDttm( value ).formatDttm14() );
                                            break;
                                        case "dttmms":
                                            $( this ).val( svc.bindDttm( value ).formatDttm17() );
                                            break;
                                        default:
                                            $( this ).val( value );
                                            break;
                                    } // close switch ($(this).attr("data-format")) {
                                    break;
                                default:
                                    $( this ).val( value );
                                    break;
                            } // close switch ($(this).attr("type").toLowerCase()) {
                            break;
                        case "select":
                            switch( $( this ).attr( "data-format" ) ) {
                                case "ym":
                                    $( this ).val( value.toString().toNumber() ).trigger( 'change' );
                                    break;
                                case 'etc':
                                    break;
                                default:
                                    $( this ).val( value ).trigger( 'change' );
                                    break;
                            }
                            break;
                        case "textarea":
                            $( this ).val( value );
                            break;
                        case "span":
                        case "th":
                        case "td":
                            switch( $( this ).attr( "data-format" ) ) {
                                case "rate":
                                    $( this ).text( value.formatDecimal( 2 ) );
                                    break;
                                case "money":
                                case "number":
                                    $( this ).text( value.formatNumber() );
                                    break;
                                case "no":
                                    $( this ).text( value.forceNumber() );
                                    break;
                                case "tel_no":
                                    $( this ).text( value.formatTelNo() );
                                    break;
                                case "biz_no":
                                    $( this ).text( value.formatBizNo() );
                                    break;
                                case "zip_no":
                                    $( this ).text( value.formatZipNo() );
                                    break;
                                case "card_no":
                                    $( this ).text( value.formatCardNo() );
                                    break;
                                case "date":
                                    $( this ).text( svc.bindDttm( value ).formatDate() );
                                    break;
                                case "time":
                                    $( this ).text( value.formatTime() );
                                    break;
                                case "ym":
                                    $( this ).text( svc.bindYm( value ).formatYm() );
                                    break;
                                case "dttm10":
                                    $( this ).text( svc.bindDttm( value ).formatDttm10() );
                                    break;
                                case "dttm12":
                                    $( this ).text( svc.bindDttm( value ).formatDttm12() );
                                    break;
                                case "dttm":
                                case "dttm14":
                                    $( this ).text( svc.bindDttm( value ).formatDttm14() );
                                    break;
                                case "dttmms":
                                    $( this ).text( svc.bindDttm( value ).formatDttm17() );
                                    break;
                                default:
                                    $( this ).text( value );
                                    if( $( this ).parent().prop( "tagName" ).toUpperCase() == 'TD' ) {
                                        $( this ).parent().attr( 'title', value );
                                    }
                                    break;
                            }
                            break;
                        default:
                            break;

                    }   // close switch(tagName) {

                }   // if(typeof(jsonData[dataKey]) != 'undefined') {

            }   // if(typeof($(this).attr("name")) != 'undefined') {

        } );   // $(this).find('div, input, select, textarea, span, th, td').each(function() {

        return this;

    };


    $.fn.validateForm = function() {

        // console.log("######  validateForm start  ###########");
       // let panelId = $(this).attr('id');
       //  console.log("panelId", panelId);

        let bValidate = true;
        let titleList = '';
        let title = '';

        $( this ).find( 'input, select, textarea' ).each( function() {

            if( typeof ( $( this ).attr( "name" ) ) != 'undefined' ) {
                // console.log("required name, val", $(this).attr("name"), $(this).val(), $(this).attr('required'));
                if( typeof ( $( this ).attr( 'required' ) ) != 'undefined' ) {
                    // console.log("required name, val", $(this).attr("name"), $(this).val());
                    if( $( this ).val() + '' == '' ) {
                        bValidate = false;
                        title = ( typeof $( this ).attr( "data-title" ) == "undefined" ) ? "Item" : $( this ).attr( "data-title" );
                        titleList += ( titleList == "" ) ? title : ", " + title;
                    }
                }

            }

        } );

        if( bValidate == false ) {
            let alertMsg = "위 항목은 필수항목 입니다. <br />확인해 주시기 바랍니다.";
            //svc.ui.alert("<strong>[ " + titleList + " ]</strong><br />" + "위 항목은 필수항목 입니다. <br />확인해 주시기 바랍니다.");
            svc.ui.alert( "<strong>[ " + titleList + " ]</strong><br />" + alertMsg );
            // alert( "<strong>[ " + titleList + " ]</strong><br />" + alertMsg );
        }

        return bValidate;

    };

}( jQuery ) );

//end-of-file