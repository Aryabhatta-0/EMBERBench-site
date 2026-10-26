"""Build illustrative reference replays with an upstream EMBERBench checkout (Python 3.12+)."""
import sys, json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'work/benchmark-source'
sys.path.insert(0,str(source/'src'))
from emberbench.scenario import load_scenario
from emberbench.baselines import NoConfig, StaticShortestPathAgent, FireAwareShortestPathAgent
from emberbench.simulator import run_episode
from emberbench.agent import agent_policy
from emberbench.visualization import export_animation, verify_animation

commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=source,text=True).strip()
worlds=[]
for path in sorted((source/'scenarios/public/v1').glob('v1-pub-*.json')):
    raw=json.loads(path.read_text())
    worlds.append({key:raw[key] for key in ['scenario_id','grid','obstacles','people','exits','ignitions']})
(root/'site/data/worlds.js').write_text('// Public initial geometry. Source and license: assets/SCENARIO-NOTICE.txt\nexport default '+json.dumps(worlds,separators=(',',':'))+';\n')
demo_ids=['v1-pub-03-corridor-bottleneck','v1-pub-04-unequal-exits','v1-pub-06-threatened-exit']
directory=root/'site/assets/demos';directory.mkdir(exist_ok=True)
index=[]
for scenario_id in demo_ids:
    scenario=load_scenario(source/f'scenarios/public/v1/{scenario_id}.json')
    item={'id':scenario_id,'policies':[],'source_commit':commit}
    for policy_id,label,agent_type in [('static-shortest-path-v1','Shortest path',StaticShortestPathAgent),('fire-aware-shortest-path-v1','Avoid current fire',FireAwareShortestPathAgent)]:
        record=run_episode(scenario,agent_policy(agent_type(NoConfig())))
        animation=export_animation(scenario,record,crowd=True)
        verify_animation(scenario,record,animation)
        name=f'{scenario_id}--{policy_id}'
        (directory/f'{name}.json').write_text(animation)
        (directory/f'{name}.record.json').write_text(record.to_json())
        item['policies'].append({'id':policy_id,'label':label,'file':f'assets/demos/{name}.json','record':f'assets/demos/{name}.record.json','record_digest':record.digest()})
        print(scenario_id,policy_id,len(record.steps))
    index.append(item)
(root/'site/data/demo-index.js').write_text('// Illustrative reference runs, independently generated; not published decision-model results.\nexport default '+json.dumps(index,separators=(',',':'))+';\n')
