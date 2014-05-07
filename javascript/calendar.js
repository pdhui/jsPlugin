!function($){

    function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments));
    }

    function UTCToday() {
        var today = new Date();
        return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
    }

    var datetimepicker = function(options){
        var settings = $.extend({},options);
        this.picker = $(".datetimepicker");
        this.language = settings.language || "en";
        this.weekStart = settings.weekStart || 1;
        this.worktime = dates[this.language].worktime;
        this.fillyears();
        this.fillmonth();
        this._attachEvents();
        this.switchhover();
        this.update();
    };
    datetimepicker.prototype = {
        _events: [],
        _cache : {},
        _attachEvents: function () {
            this._detachEvents();
            this._events = [
                [this.picker, {
                    click:   $.proxy(this.click, this)
                }]
            ];
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                el.on(ev);
            }
        },
        _detachEvents: function () {
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                el.off(ev);
            }
            this._events = [];
        },
        //fixed ie :hover bug
        switchhover : function(){
          
        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest(' td, th, span, h2, p'),
                allyears = $(".allyears"),targetnext,targetParent,selYear;
            var year = this.viewDate.getUTCFullYear(),
                month = this.viewDate.getUTCMonth();
            if (target.length == 1) {
                if (!target.is('.viewyear') && !target.is('.viewmonth')) {
                    $(".allyears").removeClass("active");
                    $(".allmonth").removeClass("active");
                }
                switch (target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch (target[0].className) {
                            case 'prev':
                            case 'next':
                                var dir = target[0].className == 'prev' ? -1 : 1;
                                this.viewDate = this.moveMonth(this.viewDate, dir);
                                break;
                        }
                        break;
                    case "td":
                        var selectDay,dayval;
                        if (target.is('.day'))
                        {                                                   
                            dayval = parseInt(target.find(".dd").text());
                            if (target.is('.old')) {
                                if (month === 0) {
                                    month = 11;
                                    year -= 1;
                                } else {
                                    month -= 1;
                                }
                            } else if (target.is('.new')) {
                                if (month == 11) {
                                    month = 0;
                                    year += 1;
                                } else {
                                    month += 1;
                                }
                            }
                            this.viewDate.setUTCFullYear(year);
                            this.viewDate.setUTCMonth(month, dayval);                        
                            console.log(this.viewDate.toLocaleString());
                        }
                        break;                     
                    case "h2" :
                        if (target.is('.viewyear') || target.is('.viewmonth')) {
                            targetnext = target.next()
                            if(targetnext.hasClass("active"))
                                targetnext.removeClass("active");
                            else
                                targetnext.addClass("active");
                        }
                        break;
                    case "p" :
                        
                        targetParent = target.parent();
                        
                        if(targetParent.is('.allyears'))
                        {
                            this.viewDate.setUTCDate(1);
                            year = target.text() || 0;
                            this.viewDate.setUTCFullYear(year);
                        }else if(targetParent.is('.allmonth')){
                            this.viewDate.setUTCDate(1);
                            month = parseInt(target.text()) -1;
                            day = this.viewDate.getUTCDate();
                            this.viewDate.setUTCMonth(month);
                        }                                  
                        break;
                    case "span":
                        var targetParent = target.parent();
                        if (targetParent.is('.toToday'))
                        {
                            this.viewDate = new Date();
                        }                       
                        break;
                }
                this.fill();
            }
        },
        fillyears : function(){
            var spanbegin = "<p >",
                spanend = "</p>"
                html = [];
            for(var i=1901; i <= 2050; i++)
            {
                html.push(spanbegin);
                html.push(i);
                html.push(spanend);
            }
            this.picker.find(".allyears").html(html.join(''));
        },
        fillmonth : function(){
            var spanbegin = "<p>",
                spanend = "</p>"
                html = [];
            for(var i=1; i <= 12; i++)
            {
                html.push(spanbegin);
                html.push(i);
                html.push(spanend);
            }
            this.picker.find(".allmonth").html(html.join(''));
        },       
        update:function(){
            this.viewDate = new Date();
            this.fill();
        },
        fill : function(){
            if(this.viewDate == null)
                return;
            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth(),
                dayMonth = d.getUTCDate(),
                hours = d.getUTCHours(),
                minutes = d.getUTCMinutes(),
                currentDate = (new UTCDate(this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth(), this.viewDate.getUTCDate())).valueOf(),
                today = new Date(),
                switchyear = parseInt(year) - 1901,
                switchmonth = parseInt(month),hasToday = false;
            var allyearsChildren = this.picker.find(".allyears").children(),
                allmonthChildren = this.picker.find(".allmonth").children();
            this.picker.find(".viewyear").text(year);
            this.picker.find(".viewmonth").text(dates[this.language].months[month]);
            allyearsChildren.removeClass("active");
            allyearsChildren.eq(switchyear).addClass("active");
            allmonthChildren.removeClass("active");
            allmonthChildren.eq(switchmonth).addClass("active");
            this.picker.find(".allyears").scrollTop(switchyear * 20 - 100);
          
            var prevMonth = UTCDate(year, month , 1, 0, 0, 0, 0),
                firstdayWeekMonth = prevMonth.getUTCDay();

            prevMonth.setUTCDate(prevMonth.getUTCDate() - (firstdayWeekMonth + 6) % 7);
            var nextMonth = new Date(prevMonth);
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var clsName, lunarDate, lunarDay, dayhtml, lunarcndate,lunarMonth,workingContent;
            for (var i=0;prevMonth.valueOf() < nextMonth;i++) {
                clsName = '';
                dayhtml = "";               
                lunarDate = getLunar(prevMonth);
                lunarcndate = cDay(parseInt(lunarDate.getUTCMonth())+1,lunarDate.getUTCDate());
                workingContent = DPGlobal.getWorkingTime(prevMonth,this.worktime);
                
                if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
                    clsName += ' old';
                } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
                    clsName += ' new';
                }
                if (prevMonth.getUTCFullYear() == today.getFullYear() &&
                    prevMonth.getUTCMonth() == today.getMonth() &&
                    prevMonth.getUTCDate() == today.getDate()) {
                    clsName += ' today';
                    this.picker.find(".switch .toToday").hide();
                    hasToday = true;
                }
                if (prevMonth.getUTCFullYear() == year &&
                    prevMonth.getUTCMonth() == month &&
                    prevMonth.getUTCDate() == dayMonth) {
                    clsName += ' selected';  
                    lunarMonth =  lunarcndate[0];                
                }
                if (prevMonth.valueOf() == currentDate) {
                    clsName += ' active';
                }
                if(i == 35 && prevMonth.getUTCDate() < 30)
                {
                     this.picker.find(".datetimepicker-days tbody td").eq(i).parent().hide();
                     break;
                }else {
                    this.picker.find(".datetimepicker-days tbody td").eq(i).parent().show();
                }   
               
                lunarDay = lunarcndate[1];
                dayhtml ="<b class='"+workingContent[0]+"'>"+workingContent[1]+"</b><b class='dd'>" + prevMonth.getUTCDate() + "</b><div class='lunarday'>"+ lunarDay + "</div>";
                this.picker.find(".datetimepicker-days tbody td").eq(i).html(dayhtml).attr("class","day "+clsName);
                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
            }
            this.picker.find(".lunarMonth").text(lunarMonth);
            if(!hasToday)
                this.picker.find(".switch .toToday").show();
        },
        moveDate: function (date, dir) {
            if (!dir) return date;
            var new_date = new Date(date.valueOf());
            //dir = dir > 0 ? 1 : -1;
            new_date.setUTCDate(new_date.getUTCDate() + dir);
            return new_date;
        },
        moveMonth: function (date, dir) {
            if (!dir) return date;
            var new_date = new Date(date.valueOf()),
                day = new_date.getUTCDate(),
                month = new_date.getUTCMonth(),
                mag = Math.abs(dir),
                new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag == 1) {
                test = dir == -1
                    // If going back one month, make sure month is not current month
                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                    ? function () {
                    return new_date.getUTCMonth() == month;
                }
                    // If going forward one month, make sure month is as expected
                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                    : function () {
                    return new_date.getUTCMonth() != new_month;
                };
                new_month = month + dir;
                new_date.setUTCMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i = 0; i < mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getUTCMonth();
                new_date.setUTCDate(day);
                test = function () {
                    return new_month != new_date.getUTCMonth();
                };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()) {
                new_date.setUTCDate(--day);
                new_date.setUTCMonth(new_month);
            }
            return new_date;
        },

        moveYear: function (date, dir) {
            return this.moveMonth(date, dir * 12);
        }
    };

    var DPGlobal = {
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        getWorkingTime : function(date,worktime){
            var key = ""+date.getUTCFullYear() + "_"+ (parseInt(date.getUTCMonth())+1) + "_" + date.getUTCDate(),
                workingContent,workcls = ["bustime","freetime",""];
            workingContent = worktime[key] || worktime["default"];
            return [workcls[workingContent],worktime.translate[workingContent]];
        }
    };

    $.fn.datetimepicker = function(options){
        return new datetimepicker(options);
    };
    var dates = $.fn.datetimepicker.dates = {
        en: {
            days:        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin:     ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            meridiem:    ["am", "pm"],
            suffix:      ["st", "nd", "rd", "th"],
            today:       "Today"
        }
    };
}(window.jQuery);