/**
 * Tayfun Erbilen - jQuery Slider Plugin (pSlider)
 */
jQuery.fn.pSlider = function(settings){

    // eklenti ayarları
    var config = jQuery.extend({
        slider: null,
        button: {
            prev: null,
            next: null
        },
        visible: 1,
        width: null,
        height: null,
        extra: 0,
        direction: 'horizontal',
        duration: 1000,
        loop: false,
        easing: null,
        start: null,
        animation: true,
        skip: 1,
        auto: false,
        time: 1000,
        keyboard: false,
        pagination: null,
        list: null,
        callback: function(){},
        callbackStart: function(){},
        callbackEnd: function(){}
    }, settings);

    var that = this;

    // callback
    if ( config.start === 0 || config.start === null ) config.callbackStart();

    // eğer genişlik değeri verilmemiş ise otomatik al
    if ( config.direction === 'horizontal' && config.width === null )
        config.width = config.slider.outerWidth() + config.extra;

    // eğer yükseklik değeri verilmemiş ise otomatik al
    if ( config.direction === 'vertical' && config.height === null )
        config.height = config.slider.outerHeight() + config.extra;

    // animasyon çalışırken değeri true, çalışmıyorken değeri false olacak
    this.animated = false;

    // slider için toplam eleman sayısı
    this.total = config.slider.length;

    // slider elemanlarının üst nesnesi
    this.parent = config.slider.parent();

    // ana slider nesnesini her ihtimale karşı gizleyelim
    this.css('overflow', 'hidden');

    // slider nesnelerine genişlik ve ya yükseklik ata
    if ( config.direction === 'horizontal' ) config.slider.width( config.width );
    else if ( config.direction === 'vertical' ) config.slider.height( config.height );

    // eğer yatay slider ise
    if ( config.direction === 'horizontal' ){

        // slider elemanlarını yan yana getirelim
        config.slider.css('float','left');

        // slider elemanlarının üst nesnesine toplam genişliği verelim
        this.parent.width( (config.width * this.total) + (config.extra * this.total) );

    }

    // eğer dikey slider ise
    else if ( config.direction === 'vertical' ){

        // slider elemanlarının üst nesnesine toplam yüksekliği verelim
        this.parent.height( (config.height * this.total) + (config.extra * this.total) );

    }

    // eğer sayfalama seçilmiş ise
    if ( config.pagination ){
        if ( that.total === 1 ){
            config.pagination.hide();
        } else {

            for ( var i = 1; i <= that.total; i++ ){
                config.pagination.append('<a href="#"' + (i === 1 ? ' class="active"' : null) + '>' + i + '</a>');
            }

            config.pagination.find('a').on('click', function(e){
                config.start = $(this).index();
                that.animation('text');
                e.preventDefault();
            });

        }
    }

    // eğer liste seçilmiş ise
    if ( config.list ){
        config.list.filter(':first').addClass('active');
        config.list.on('click', function(e){
            config.start = $(this).index();
            that.animation('text');
            e.preventDefault();
        });
    }

    // animasyon işlemi
    this.animation = function(button){

        // eğer animasyon çalışmıyorsa
        if ( that.animated === false ){

            // animasyonun çalıştığını söyle
            that.animated = true;

            if ( button === 'next' ){

                // eğer mevcut değer toplam - görünen elemanlardan küçük ise işleme devam et
                if ( config.start < that.total - config.visible ){

                    // mevcut değeri hesapla
                    config.start = config.start + config.skip;

                    // eğer hesaplanan değer toplam - görünen eleman sayısından büyük ise tekrardan değer ataması yap
                    if ( config.start > that.total - config.visible ) config.start = that.total - config.visible;

                }
                // değilse ve döngü var ise mevcut değeri 0'a eşitle
                else {
                    if ( config.loop ) config.start = 0;
                    else that.animated = false;
                }

            } else if ( button === 'prev' ){

                // eğer mevcut değer 0'dan büyük ise azaltmaya devam et
                if ( config.start > 0 ){

                    // mevcut değeri hesapla
                    config.start = config.start - config.skip;

                    // eğer hesaplanan değer 0'dan küçük ise değeri tekrar 0'a eşitle
                    if ( config.start < 0 ) config.start = 0;

                }
                // değilse ve döngü var ise mevcut değeri toplam eksik görünen eleman sayısıne eşitle
                else {
                    if ( config.loop ) config.start = that.total - config.visible;
                    else that.animated = false;
                }

            }

            if ( config.direction === 'horizontal' ){
                that.obj = {marginLeft: '-' + ( (config.start * config.width) + (config.extra * config.start) )};
            }
            else if ( config.direction === 'vertical' ){
                that.obj = {marginTop: '-' + ( (config.start * config.height)  + (config.extra * config.start) )};
            }

            that.parent.stop().animate(that.obj, {
                duration: config.duration,
                complete: function(){

                    // animasyonun çalışmadığını söyle
                    that.animated = false;

                    // sayfalama aktif ise
                    if ( config.pagination ){
                        config.pagination.find('a').removeClass('active').eq(config.start).addClass('active');
                    }

                    // liste aktif ise
                    if ( config.list ){
                        config.list.removeClass('active').eq(config.start).addClass('active');
                    }

                },
                easing: (config.easing) ? config.easing : null
            });

            // callback
            if ( config.start === that.total - config.visible ) config.callbackEnd();
            else if ( config.start === 0 || config.start === null ) config.callbackStart();
            else config.callback();

        }

    };

    if ( config.button.next ){
        config.button.next.on('click', function(e){
            that.animation('next');
            e.preventDefault();
        });
    }

    if ( config.button.prev ){
        config.button.prev.on('click', function(e){
            that.animation('prev');
            e.preventDefault();
        });
    }

    // eğer başlangıç değişecek ise kontrol et
    if ( config.start > 0 ){

        config.start = config.start - 1;

        // eğer girilen başlangıç değeri toplam değerden büyük ise başlangıç değerini otomatik olarak toplam değer yap
        if ( config.start > this.total ) config.start = this.total;

        // eğer başlangıç değerine animasyonlu şekilde geçiş yapacak ise burayı çalıştır
        if ( config.animation ){
            this.animation('next');
        }
        // görünmeden yapacak isede burayı çalıştır, dikey ve yataya göre hesapla
        else {

            config.start = config.start + 1;

            if ( config.direction === 'horizontal' )
                this.parent.css('margin-left', '-' + ( (config.start) * config.width ) + 'px');
            else if ( config.direction === 'vertical' )
                this.parent.css('margin-top', '-' + ( (config.start) * config.height ) + 'px');

            // sayfalama aktif ise
            if ( config.pagination ){
                config.pagination.find('a').removeClass('active').eq(config.start).addClass('active');
            }

            // liste aktif ise
            if ( config.list ){
                config.list.removeClass('active').eq(config.start).addClass('active');
            }

        }
    }

    // klavye kontrolü
    if ( config.keyboard ){
        this.keyboard = function(event){
            var key = event.which || event.keyCode;
            if ( config.direction === 'horizontal' ){
                if ( key === 37 ) that.animation('prev');
                else if ( key === 39 ) that.animation('next');
            } else if ( config.direction === 'vertical' ){
                if ( key === 40 ) that.animation('prev');
                else if ( key === 38 ) that.animation('next');
            }
            return false;
        };
        this.hover(function(){
            $(document).on('keydown', that.keyboard);
        }, function(){
            $(document).off('keydown', that.keyboard);
        });
    }

    // eğer otomatik dönme var ise
    if ( config.auto ){

        // otomatik döngüyü aktif et
        config.loop = true;

        // otomatik döndürme işlemini başlat
        this.interval = setInterval(function(){
            that.animation('next');
        }, config.time);

        this.hover(function(){
            clearInterval(that.interval);
            that.interval = null;
        }, function(){
            that.interval = setInterval(function(){
                that.animation('next');
            }, config.time);
        });

    }

    // yeniden boyutlandırma
    this.bind('resize', function(event, arg){
        that.animated = false;
        config.start = config.start + 1;
        arg = jQuery.extend(config, arg);
        $(this).pSlider(arg);
    });

};
