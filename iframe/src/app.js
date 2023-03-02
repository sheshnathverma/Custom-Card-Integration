(() => {
    
    const enateAppUrl = new URL("<enate application instance url>");

    // send message to top window
    const callbackMap = {};
    const sendMessage = (data, fn) => {
        const token = Date.now() + " - " + performance.now();
        const src = location.href.toLowerCase()
        callbackMap[token] = fn || (() => { });
        top.postMessage({ src, token, data }, enateAppUrl.origin);
    };

    // message listener from other window to this
    self.addEventListener('message', (e) => {
        const fn = callbackMap[e.data?.token];
        if (typeof fn === "function") {
            delete callbackMap[e.data.token];
            fn(e.data.data);
        }
    });


    // element refs
    const root = document.getElementById('root');
    const result = root.querySelector('.result');
    const btnGetInfo = root.querySelector('#btn-get-info');
    const btnUpdateInfo = root.querySelector('#btn-update-info');
    const btnAddValidation = root.querySelector('#btn-add-validation');
    const btnRemoveValidation = root.querySelector('#btn-remove-validation');
    const btnCallEnateApi = root.querySelector('#btn-call-enate-api');
    const btnCallAnyOtherApi = root.querySelector('#btn-call-any-other-api');


    // functionally 
    function GetInfo() {
        sendMessage({ type: "GetInfo" }, (d) => {
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(d, undefined, 2);
            result.innerHTML = '';
            result.appendChild(pre);
        });
    }
    function UpdateTitle() {
        sendMessage({
            type: "UpdateTitle",
            title: 'new title at ' + new Date()
        }, () => {
            result.innerHTML = 'Title update Done!';
        });
    }
    function AddValidation() {
        sendMessage({
            type: "AddValidation",
            title: 'new title at ' + new Date()
        }, () => {
            result.innerHTML = 'Validation Added!';
        });
    }
    function RemoveValidation() {
        sendMessage({
            type: "RemoveValidation",
            title: 'new title at ' + new Date()
        }, () => {
            result.innerHTML = 'Validation Removed!';
        });
    }
    function CallEnateAPI() {
        sendMessage({
            type: "CallEnateAPI",
            title: 'new title at ' + new Date()
        }, (d) => {
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(d, undefined, 2);
            result.innerHTML = '';
            result.appendChild(pre);
        });
    }


    // events
    btnGetInfo.addEventListener('click', () => {
        GetInfo();
    });
    btnUpdateInfo.addEventListener('click', () => {
        UpdateTitle();
    });
    btnAddValidation.addEventListener('click', () => {
        AddValidation();
    });
    btnRemoveValidation.addEventListener('click', () => {
        RemoveValidation();
    });
    btnCallEnateApi.addEventListener('click', () => {
        CallEnateAPI();
    });
    btnCallAnyOtherApi.addEventListener('click', () => {
        // we can call your own api here
        result.innerHTML = 'TODO: You can write a code to call your own API';
    });
})();