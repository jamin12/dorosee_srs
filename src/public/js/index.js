function main() {
    const mainView = new MainView();
    const mainModel = new MainModel(mainView);
    const mainController = new MainController(mainView, mainModel);
    mainController.mainInit();
}

main();
