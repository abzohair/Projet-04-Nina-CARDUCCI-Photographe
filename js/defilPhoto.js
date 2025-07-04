(function ($) {
    // let currentIndex = 0;
    // let imagesCollection = [];

    $.fn.mauGallery = function (options) {
        var options = $.extend($.fn.mauGallery.defaults, options);
        var tagsCollection = [];

        return this.each(function () {
            $.fn.mauGallery.methods.createRowWrapper($(this));

            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox(
                    $(this),
                    options.lightboxId,
                    options.navigation
                );
            }

            $.fn.mauGallery.listeners(options);

            $(this)
                .children(".gallery-item")
                .each(function () {
                    $.fn.mauGallery.methods.responsiveImageItem($(this));
                    $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
                    $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);

                    const theTag = $(this).data("gallery-tag");
                    if (options.showTags && theTag && !tagsCollection.includes(theTag)) {
                        tagsCollection.push(theTag);
                    }
                });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags(
                    $(this),
                    options.tagsPosition,
                    tagsCollection
                );
            }

            $(this).fadeIn(500);
        });
    };

    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: "galleryLightbox",
        showTags: true,
        tagsPosition: "bottom",
        navigation: true,
    };

    $.fn.mauGallery.listeners = function (options) {
        $(".gallery-item").on("click", function () {
            if (options.lightBox && $(this).prop("tagName") === "IMG") {
                $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
            }
        });

        $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

        $(".gallery").on("click", ".mg-prev", function () {
            $.fn.mauGallery.methods.prevImage();
        });

        $(".gallery").on("click", ".mg-next", function () {
            $.fn.mauGallery.methods.nextImage();
        });
    };

    $.fn.mauGallery.methods = {
        createRowWrapper(element) {
            if (!element.children().first().hasClass("row")) {
                element.append('<div class="gallery-items-row row"></div>');
            }
        },

        wrapItemInColumn(element, columns) {
            let colClass = "";

            if (typeof columns === "number") {
                colClass = `col-${Math.ceil(12 / columns)}`;
            } else if (typeof columns === "object") {
                if (columns.xs) colClass += ` col-${Math.ceil(12 / columns.xs)}`;
                if (columns.sm) colClass += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                if (columns.md) colClass += ` col-md-${Math.ceil(12 / columns.md)}`;
                if (columns.lg) colClass += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                if (columns.xl) colClass += ` col-xl-${Math.ceil(12 / columns.xl)}`;
            }

            element.wrap(`<div class='item-column mb-4 ${colClass}'></div>`);
        },

        moveItemInRowWrapper(element) {
            element.appendTo(".gallery-items-row");
        },

        responsiveImageItem(element) {
            if (element.prop("tagName") === "IMG") {
                element.addClass("img-fluid");
            }
        },

        // openLightBox(element, lightboxId) {
        //     const activeTag = $(".tags-bar .active-tag").data("images-toggle");

        //     imagesCollection = [];

        //     $(".item-column img").each(function () {
        //         const $img = $(this);
        //         const tag = $img.data("gallery-tag");

        //         if (activeTag === "all" || tag === activeTag) {
        //             imagesCollection.push($img);
        //         }
        //     });

        //     currentIndex = imagesCollection.findIndex((img) => img.attr("src") === element.attr("src"));

        //     $(`#${lightboxId} .lightboxImage`).attr("src", element.attr("src"));
        //     $(`#${lightboxId}`).modal("show");
        // },

        // prevImage() {
        //     if (!imagesCollection.length) return;
        //     currentIndex = (currentIndex - 1 + imagesCollection.length) % imagesCollection.length;
        //     $(".lightboxImage").attr("src", imagesCollection[currentIndex].attr("src"));
        // },

        // nextImage() {
        //     if (!imagesCollection.length) return;
        //     currentIndex = (currentIndex + 1) % imagesCollection.length;
        //     $(".lightboxImage").attr("src", imagesCollection[currentIndex].attr("src"));
        // },

        createLightBox(gallery, lightboxId, navigation) {
            gallery.append(`
          <div class="modal fade" id="${lightboxId}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-body position-relative text-center">
                  ${navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;padding:10px;">←</div>'
                    : ''
                }
                  <img class="lightboxImage img-fluid" alt="Aperçu image" />
                  ${navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;padding:10px;">→</div>'
                    : ''
                }
                </div>
              </div>
            </div>
          </div>`);
        },

        showItemTags(gallery, position, tags) {
            let tagItems = `
          <li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>`;
            $.each(tags, function (_, tag) {
                tagItems += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
            });

            const tagRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

            if (position === "bottom") {
                gallery.append(tagRow);
            } else if (position === "top") {
                gallery.prepend(tagRow);
            } else {
                console.error(`Unknown tags position: ${position}`);
            }
        },

        filterByTag() {
            if ($(this).hasClass("active-tag")) return;

            $(".active-tag").removeClass("active active-tag");
            // $(this).addClass("active active-tag");

            const tag = $(this).data("images-toggle");

            $(".gallery-item").each(function () {
                const $item = $(this);
                const $col = $item.closest(".item-column");

                if (tag === "all" || $item.data("gallery-tag") === tag) {
                    $col.show(300);
                } else {
                    // $col.hide(300);
                }
            });
        }
    };
})(jQuery);
