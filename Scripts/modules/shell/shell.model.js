define([], function (mvvm) {
    function view(vm, html) {
        this.viewModel = vm;
        this.html = html;
    }

    view.prototype.display = function () {
        if (this.region == null) throw "View not registered to a region. Unable to display.";
        this.currentView = this;
        this.region.html = this.html;
        if (this.init) this.init();
        if (this.render) $(this.render());
    };

    view.prototype.unregister = function () {
        if (this.region == null) throw "View not registered to a region. Unable to unregister.";
        this.region = null;
        region.views.environments.remove(this);
    };

    function region(shell, element) {
        this.shell = shell;
        this.element = element;
    }

    region.prototype.views = [];

    region.prototype.registerView = function (view) {
        view.region = this;
        view.region.shell.views.push(view);
        this.views.push(view);
        if (view.register) view.register();
        return view;
    };

    return {
        bindings: [],
        View: view,
        Region: region,
        views: [],
        regions: [],
        registerRegion: function (region) {
            region.shell = this;
            this.regions.push(region);
            if (region.register) region.register();
            return region;
        }
    };
});