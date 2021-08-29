
const _procs = [];

export default {

  it(label, target) {
    const proc = async () => {
      try {
        await target();
        return {
          label,
          succeeded: true,
        };
      }
      catch (exception) {
        return {
          label,
          succeeded: false,
          exception,
        };
      }
    };
    _procs.push(proc());
  },

  async exec() {
    const results = await Promise.allSettled(_procs);
    let html = "";
    for (const resultObj of results) {
      const result = resultObj.value;
      if (result) {
        const status = `<span style="background-color: ${ (result.succeeded === true) ? "#74f0bc" : "#fb7878" };">${ (result.succeeded === true) ? "Succeeded" : "Failed" }</span>`;
        const message = `${ e(result.label) }${ (result.succeeded === true) ? "" : "<br />" + e(result.exception?.message) }`;
        html = html + `<li>${ status }: ${ message }</li>`;
      }
      else {
        html = html + `<li><span>?</span></li>`;
      }
    }

    const passed = results.filter((result) => result.value?.succeeded === true).length;

    document.body.innerHTML = `<div><ol>${ html }</ol><div>${ passed } / ${ results.length }</div></div>`;
  },

  assert: {
    strictEqual(a, b) {
      if (a === b) {
        return;
      }
      throw new Error(`failed:strictEqual - actual:${ val(a) }, expected:${ val(b) }`);
    },

    notStrictEqual(a, b) {
      if (a !== b) {
        return;
      }
      throw new Error(`failed:notStrictEqual - actual:${ val(a) }, expected:${ val(b) }`);
    },

    throws(func, err) {
      try {
        func();
      }
      catch (exception) {
        for (const i in err) {
          if (exception[i] === err[i]) {
            continue;
          }
          throw new Error(`failed:throws - actual[${ val(i) }]:${ val(err[i]) }, expected[${ val(i) }]:${ val(exception[i]) }`);
        }
        return;
      }
      throw new Error(`failed:throws - no exception`);
    },
  },
};

function e(s) {
  if (typeof s === "string") {
    return s.replaceAll("&", "&#x26;").replaceAll("<", "&#x3C;");
  }
  return "";
}

function val(v) {
  if (typeof v === "string") {
    return '"' + e(v) + '"';
  }
  else if (typeof v === "number") {
    return e(v.toString());
  }
  else if (typeof v === "boolean") {
    return e(v.toString());
  }
  else if (typeof v === "undefined") {
    return "undefined";
  }
  else if (v === null) {
    return "null";
  }
  else {
    alert("");
  }
}
