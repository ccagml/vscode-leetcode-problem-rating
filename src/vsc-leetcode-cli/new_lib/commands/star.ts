
import { helper } from "../helper";
import { log } from "../log";
import { corePlugin } from "../core";
import { session } from "../session";

class StarCommand {
  constructor() {

  }

  process_argv(argv) {
    var argv_config = helper.base_argv().option('d', {
      alias: 'delete',
      type: 'boolean',
      describe: 'Unstar question',
      default: false
    })
      .positional('keyword', {
        type: 'string',
        describe: 'Question name or id',
        default: ''
      })


    argv_config.process_argv(argv)

    return argv_config.get_result()
  }

  handler(argv) {
    session.argv = argv;
    // translation doesn't affect question lookup
    corePlugin.getProblem(argv.keyword, true, function (e, problem) {
      if (e) return log.fail(e);

      corePlugin.starProblem(problem, !argv.delete, function (e, starred) {
        if (e) return log.fail(e);

        log.info('[%s] %s %s', problem.fid, problem.name,
          starred ? 'icon.like' : 'icon.unlike');

        corePlugin.updateProblem(problem, { starred: starred });
      });
    });
  };

}


export const starCommand: StarCommand = new StarCommand();