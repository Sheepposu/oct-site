# Generated by Django 4.2.2 on 2024-06-14 18:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('achievements', '0006_achievement_beatmap_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='BeatmapInfo',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('artist', models.CharField()),
                ('version', models.CharField()),
                ('title', models.CharField()),
                ('cover', models.CharField()),
                ('star_rating', models.FloatField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='achievement',
            name='beatmap_id',
        ),
        migrations.AddField(
            model_name='achievement',
            name='beatmap',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='achievements', to='achievements.beatmapinfo'),
        ),
    ]
