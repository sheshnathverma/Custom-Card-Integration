# Third Party WebApp integration by Iframe with Custom Card

## Create a Advance Custom Card

Create work manager advance custom card ([see the documentation here](https://docs.enate.net/enate-help/builder/builder-2021.1/custom-data-and-custom-card-configuration/super-flexible-cards)) 

### TypeScript Section

Add following code at the end of component

```TypeScript
        //YOUR CUSTOM CODE BEGINS


        //YOUR CUSTOM CODE ENDS
    }

    // <Following code will be here>
}

```

```TypeScript
@ViewChild('iframe', { static: false }) iframe: ElementRef;

// your web application url and please add unique iframe-id every time for avoiding conflict
appUrl = new URL("http://localhost/iframe-app/index.html?iframe-id=" + Date.now() + '-' + performance.now());

ngOnDestroy() {
    // remove event listener
    window.removeEventListener('message', this.messageListener, true);
}
// every time on frame load event remove the old event listener and add new one for target 
iframeLoaded(e) {
    // remove event listener first
    window.removeEventListener('message', this.messageListener, true);

    if (e.target.src !== this.appUrl.href) {
        e.target.src = this.appUrl.href;
    } else {
        // add event listener after load
        this.messageListener = (e) => { this.messageRecieved(e.data); }
        window.addEventListener('message', this.messageListener, true);
    }
}
sendMessage(token, data) {
    const win = this.iframe
        && this.iframe.nativeElement
        && this.iframe.nativeElement.contentWindow;
    if (win && win.postMessage) {
        win.postMessage(
            { token, data },
            this.appUrl.origin
        );
    }
}

stopSubmitValidator = null;
messageListener = null;
messageRecieved(e) {
    if (e && e.src === this.appUrl.href) {
        switch (e.data.type) {
            case "GetInfo": {
                this.sendMessage(
                    e.token,
                    JSON.parse(JSON.stringify(this.Packet.toJson()))
                );
            } break;
            case "UpdateTitle": {
                this.Packet.Title = e.data.title;
                this.sendMessage(e.token, {});
            } break;
            case "AddValidation": {
                if (!this.Option
                    .Card
                    .Validators
                    .includes(this.stopSubmitValidator)) {
                    this.stopSubmitValidator = (
                        packet: CasePacketForUI,
                        cardOptions: ICardOption) => {
                        return WorkItemValidator.ERRORS(
                            null,
                            [
                                "You cannot submit because external tool is working on atm"
                            ]
                        );
                    };
                    this.Option
                        .Card
                        .Validators
                        .push(this.stopSubmitValidator);
                }
                this.sendMessage(e.token, {});
            } break;
            case "RemoveValidation": {
                this.Option.Card.Validators = this.Option
                    .Card
                    .Validators
                    .filter(x => x !== this.stopSubmitValidator);
                this.stopSubmitValidator = null;
                this.sendMessage(e.token, {});
            } break;
            case "CallEnateAPI": {
                fetch('<enate application instance url>/WebAPI/UserProfile/GetProfile')
                    .then(d => d.json())
                    .then(d => {
                        this.sendMessage(e.token, d);
                    });

            } break;
        }
    }
}
``` 

### HTML Section

Add iframe in html section

```HTML
<iframe 
    #iframe 
    (load)="iframeLoaded($event)" 
    style="width:100%; height:100vh;"
></iframe>
```

## Host given iframe folder  

Please host iframe folder any where of your choose and update `http://localhost/iframe-app` with your hosted URL and inside `iframe/src/app.js` file update variable `enateAppUrl` () with your enate instance application URL
