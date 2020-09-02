var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'clear', 'clock', 'date', 'echo', 'help', 'logout', 'ls', 'start', 'uname', 'whoami'
  ];

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'clock':
          var appendDiv = jQuery($('.clock-container')[0].outerHTML);
          appendDiv.attr('style', 'display:inline-block');
          output_.appendChild(appendDiv[0]);
          break;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
          output( args.join(' ') );
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'uname':
          output(navigator.appVersion);
          break;
        case 'whoami':
          var wswitch = args.join(' ');
          if(wswitch == 'really') {
            var result = "<img style=\"width: 200px; height: 200px\" src=\"http://memes.ucoz.com/_nw/59/03380775.jpg\"><br><br>";
            output(result);
            break;
          }
          else {
            var result = "<img style=\"width: 200px; height: 200px\" src=\"IMG_1169.jpg\"><br><br>";
            output(result);
            break;
          }
        case 'logout':
          window.close();
          break;
        case 'ls':
          const availableProj = ['toughnut5', 'hackintoshbot'];
          var a = args.join(' ');
          if(!a) {
            output('<div class="ls-files">' + availableProj.join('<br>') + '</div>');
            break;
          }
          else if(a == '-la') {
            output('total ' + availableProj.length);
            output('drwxr-xr-x  2 user user  4096 Sep  1 22:39 .');
            output('drwxr-xr-x  6 root root  4096 Sep  1 22:39 ..');
            output('-rwxr-xr--  1 user user  4096 Mar  3 15:27 toughnut5.lnk');
            output('-rwxr-xr--  1 user user  4096 Aug 28 23:46 hackintoshbot.lnk');
            break;
          }
          else {
            output('<div class="ls-files">' + availableProj.join('<br>') + '</div>');
            break;
          }
        case 'start':
          const availableFiles = ['toughnut5.lnk', 'hackintoshbot.lnk'];
          var a = args.join(' ');
          if(!a) {
            output('Usage: ' + cmd + ' [filename]');
            break;
          }
          switch(a) {
            case 'toughnut5.lnk':
              location.href = '/toughnut5.html';
              break;
            case 'hackintoshbot.lnk':
              location.href = 'http://bot.arigata9.de';
              break;
            default:
              output(a + ': File not found.');
          }
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<img align="left" src="http://bot.arigata9.de/images/cube.gif" width="100" height="100" style="padding: 0px 10px 20px 0px"><h2 style="letter-spacing: 4px">A R I G A T A 9</h2><p>' + new Date() + '</p><p>Enter "help" for a list of available commands.</p>');
    },
    output: output
  }
};
